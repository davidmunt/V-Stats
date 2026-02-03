const asyncHandler = require("express-async-handler");
const Match = require("../models/match.model");
const League = require("../models/league.model");
const Team = require("../models/team.model");
const Venue = require("../models/venue.model");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");
const Player = require("../models/player.model");
const Lineup = require("../models/lineup.model");
const LineupPosition = require("../models/lineupPosition.model");

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
    .sort({ date: 1 })
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

const getNextMatchAnalyst = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const analyst = await Analyst.findOne({ slug }).select("team_id");
  if (!analyst || !analyst.team_id) {
    return res.status(404).json({ message: "Analista no encontrado" });
  }

  const teamId = analyst.team_id;

  // 1. Prioridad: ¿Hay algo en LIVE?
  let match = await Match.findOne({
    $or: [{ local_team_id: teamId }, { visitor_team_id: teamId }],
    status: "live",
    is_active: true,
  }).populate("local_team_id visitor_team_id venue_id");

  // 2. Si no hay LIVE, buscamos el "siguiente" razonable
  if (!match) {
    // CALCULAMOS EL INICIO DE HOY (00:00:00)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    match = await Match.findOne({
      $or: [{ local_team_id: teamId }, { visitor_team_id: teamId }],
      status: "scheduled",
      // Buscamos partidos de hoy (aunque ya haya pasado la hora) o futuros
      date: { $gte: todayStart },
      is_active: true,
    })
      .populate("local_team_id visitor_team_id venue_id")
      .sort({ date: 1 }); // El más antiguo de los futuros (el más cercano)
  }

  if (!match) {
    return res.status(200).json({
      match: null,
      message: "No hay partidos para hoy ni próximos.",
    });
  }

  res.status(200).json({
    match: match.toMatchResponse(),
  });
});

const getMatchDataForAnalysis = asyncHandler(async (req, res) => {
  const { matchSlug } = req.params;

  // 1. Buscamos el partido y populamos los equipos
  const match = await Match.findOne({ slug: matchSlug }).populate("local_team_id").populate("visitor_team_id");

  if (!match) return res.status(404).json({ message: "Partido no encontrado" });

  // 2. Buscamos los jugadores de ambos equipos
  const players = await Player.find({
    id_team: { $in: [match.local_team_id._id, match.visitor_team_id._id] },
    is_active: true,
  });

  // 3. Buscamos las alineaciones activas
  const lineups = await Lineup.find({
    match_id: match._id,
    is_active: true,
  });

  // 4. Buscamos las posiciones (con los datos del jugador populados)
  const lineupPositions = await LineupPosition.find({
    lineup_id: { $in: lineups.map((l) => l._id) },
    is_active: true,
  }).populate("player_id");

  // --- TRANSFORMACIONES PARA LIMPIAR DATOS ---

  // A) Formatear Equipos: _id -> id_team
  const formatTeam = (team) => ({
    id_team: team._id,
    name: team.name,
    slug: team.slug,
    image: team.image,
    coach_id: team.coach_id,
    analyst_id: team.analyst_id,
    // No incluimos __v, createdAt, etc.
  });

  // B) Formatear Jugadores: _id -> id_player
  const formatPlayer = (p) => ({
    id_player: p._id,
    id_team: p.id_team,
    name: p.name,
    slug: p.slug,
    dorsal: p.dorsal,
    role: p.role,
    image: p.image,
  });

  // C) Formatear Posiciones (Aplanado, igual que en getMatchLineups)
  const formatPosition = (pos) => {
    const p = pos.player_id; // Objeto player populado
    return {
      id_lineup_position: pos._id,
      id_lineup: pos.lineup_id,
      slug: pos.slug,
      initial_position: pos.initial_position,
      current_position: pos.current_position,
      is_on_court: pos.is_on_court,
      // Datos planos del jugador
      id_player: p ? p._id : null,
      name: p ? p.name : null,
      dorsal: p ? p.dorsal : null,
      role: p ? p.role : null,
      image: p ? p.image : null,
    };
  };

  // --- RESPUESTA ---
  res.status(200).json({
    // Aplicamos el formato a los equipos local y visitante
    teams: [formatTeam(match.local_team_id), formatTeam(match.visitor_team_id)],
    // Limpiamos la lista de jugadores
    players: players.map(formatPlayer),
    // Devolvemos las alineaciones (puedes añadir .map si quieres limpiar _id aquí también)
    lineups: lineups.map((l) => ({
      id_lineup: l._id,
      id_team: l.team_id,
      status: l.status,
      slug: l.slug,
    })),
    // Limpiamos y aplanamos las posiciones
    positions: lineupPositions.map(formatPosition),
  });
});

const startMatch = asyncHandler(async (req, res) => {
  const { matchSlug } = req.params;

  const match = await Match.findOne({ slug: matchSlug });
  if (!match) return res.status(404).json({ message: "Partido no encontrado" });

  // Si el partido ya está LIVE, no hacemos nada, simplemente devolvemos OK
  // Esto evita errores si el segundo analista pulsa el botón
  if (match.status === "live") {
    return res.status(200).json({ message: "El partido ya está en vivo", status: match.status });
  }

  // Si ya terminó, tampoco lo movemos a live
  if (match.status === "finished") {
    return res.status(400).json({ message: "El partido ya ha finalizado" });
  }

  // Cambiamos el estado a live
  match.status = "live";
  await match.save();

  res.status(200).json({
    message: "Partido empezado correctamente",
    status: match.status,
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
  getNextMatchAnalyst,
  getMatchDataForAnalysis,
  startMatch,
  updateMatch,
  deleteMatch,
};
