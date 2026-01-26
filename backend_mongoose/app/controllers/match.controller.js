const asyncHandler = require("express-async-handler");
const Match = require("../models/match.model");
const League = require("../models/league.model");
const Team = require("../models/team.model");
const Venue = require("../models/venue.model");
const Coach = require("../models/coach.model");

const createMatch = asyncHandler(async (req, res) => {
  const { leagueSlug } = req.params;
  const { id_team_local, id_team_visitor, date } = req.body; // Ya no pedimos id_venue

  if (!leagueSlug || !id_team_local || !id_team_visitor || !date) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  // 1. Validar Liga
  const league = await League.findOne({ slug: leagueSlug, admin_id: req.userId });
  if (!league) return res.status(403).json({ message: "Liga no encontrada o sin permiso" });

  // 2. Obtener la Venue directamente del equipo local
  const localTeam = await Team.findById(id_team_local);
  if (!localTeam) return res.status(404).json({ message: "Equipo local no encontrado" });

  if (!localTeam.id_venue) {
    return res.status(400).json({ message: "El equipo local no tiene una sede asignada" });
  }

  // 3. Crear el partido
  const newMatch = await Match.create({
    league_id: league._id,
    local_team_id: id_team_local,
    visitor_team_id: id_team_visitor,
    venue_id: localTeam.id_venue, // Automatizado desde el modelo Team
    date,
    created_by_admin_id: req.userId,
    status: "scheduled",
  });

  const populatedMatch = await Match.findById(newMatch._id)
    .populate("local_team_id", "name image")
    .populate("visitor_team_id", "name image")
    .exec();

  res.status(201).json({ match: populatedMatch.toMatchResponse() });
});

const getMatchesByLeague = asyncHandler(async (req, res) => {
  const { leagueSlug } = req.params;

  const league = await League.findOne({ slug: leagueSlug });

  if (!league) return res.status(404).json({ message: "Liga no encontrada" });

  const matches = await Match.find({ league_id: league._id, is_active: true })

    .populate("local_team_id", "name image")

    .populate("visitor_team_id", "name image")

    .sort({ date: 1 })

    .exec();

  // Transformamos cada match al formato de tu interfaz

  res.status(200).json({
    matches: matches.map((m) => m.toMatchResponse()),
  });
});

const getMatchBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const match = await Match.findOne({ slug, is_active: true })

    .populate("local_team_id", "name image")

    .populate("visitor_team_id", "name image")

    .exec();

  if (!match) return res.status(404).json({ message: "Partido no encontrado" });

  res.status(200).json({ match: match.toMatchResponse() });
});

const getCoachMatches = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // 1. Buscamos al coach y su equipo
  const coach = await Coach.findOne({ slug }).select("team_id");
  if (!coach || !coach.team_id) {
    return res.status(404).json({ message: "El coach no tiene un equipo asignado" });
  }

  // 2. Buscamos partidos donde el equipo sea local O visitante
  const matches = await Match.find({
    $or: [{ local_team_id: coach.team_id }, { visitor_team_id: coach.team_id }],
    is_active: true,
  })
    .populate("local_team_id", "name image slug")
    .populate("visitor_team_id", "name image slug")
    .populate("venue_id", "name city")
    .sort({ date: 1 }); // Ordenados por fecha próxima

  res.status(200).json({
    matches: matches.map((m) => m.toMatchResponse()),
  });
});

const getNextMatch = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // 1. Buscamos al coach para obtener su equipo
  const coach = await Coach.findOne({ slug }).select("team_id");
  if (!coach || !coach.team_id) {
    return res.status(404).json({ message: "El coach no tiene equipo asignado" });
  }

  // 2. Buscamos el partido más cercano en el tiempo
  const nextMatch = await Match.findOne({
    $or: [{ local_team_id: coach.team_id }, { visitor_team_id: coach.team_id }],
    status: "scheduled", // Solo partidos programados
    date: { $gte: new Date() }, // Fecha igual o posterior a la actual
    is_active: true,
  })
    .populate("local_team_id", "name image slug")
    .populate("visitor_team_id", "name image slug")
    .populate("venue_id", "name city")
    .sort({ date: 1 }) // Orden ascendente (el más cercano primero)
    .exec();

  if (!nextMatch) {
    return res.status(200).json({
      match: null,
      message: "No hay partidos próximos programados",
    });
  }

  res.status(200).json({
    match: nextMatch.toMatchResponse(),
  });
});

const updateMatch = asyncHandler(async (req, res) => {
  const { leagueSlug, matchSlug } = req.params;
  const updates = req.body;

  const league = await League.findOne({ slug: leagueSlug, admin_id: req.userId });
  if (!league) return res.status(403).json({ message: "Permiso denegado" });

  const match = await Match.findOne({ slug: matchSlug, league_id: league._id });
  if (!match) return res.status(404).json({ message: "Partido no encontrado" });

  // Si cambian el equipo local, actualizamos la venue automáticamente
  if (updates.id_team_local) {
    const newLocalTeam = await Team.findById(updates.id_team_local);
    if (newLocalTeam) {
      match.local_team_id = updates.id_team_local;
      match.venue_id = newLocalTeam.id_venue;
    }
  }

  if (updates.id_team_visitor) match.visitor_team_id = updates.id_team_visitor;

  const allowedUpdates = ["date", "status", "current_set", "is_active"];
  allowedUpdates.forEach((key) => {
    if (updates[key] !== undefined) match[key] = updates[key];
  });

  await match.save();
  const updatedMatch = await Match.findById(match._id)
    .populate("local_team_id", "name image")
    .populate("visitor_team_id", "name image")
    .exec();

  res.status(200).json({ match: updatedMatch.toMatchResponse() });
});

const deleteMatch = asyncHandler(async (req, res) => {
  const { leagueSlug, matchSlug } = req.params;

  // Buscamos la liga para validar al admin
  const league = await League.findOne({ slug: leagueSlug, admin_id: req.userId });
  if (!league) return res.status(403).json({ message: "No tienes permiso" });

  const match = await Match.findOneAndUpdate({ slug: matchSlug, league_id: league._id }, { is_active: false }, { new: true });

  if (!match) return res.status(404).json({ message: "Partido no encontrado" });
  res.status(200).json({ message: "Partido eliminado correctamente" });
});

module.exports = {
  createMatch,
  getMatchesByLeague,
  getMatchBySlug,
  getCoachMatches,
  getNextMatch,
  updateMatch,
  deleteMatch,
};
