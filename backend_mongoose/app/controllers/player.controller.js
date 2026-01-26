const asyncHandler = require("express-async-handler");
const Player = require("../models/player.model");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");
const Team = require("../models/team.model");
const slugify = require("slugify");

// Crear jugador (el slug recibido es el del Coach)
const createPlayer = asyncHandler(async (req, res) => {
  const { slug: coachSlug, name, dorsal, role, image } = req.body;

  const coach = await Coach.findOne({ slug: coachSlug });
  if (!coach || !coach.team_id) {
    return res.status(404).json({ message: "Coach no encontrado o sin equipo asignado" });
  }

  // VALIDACIÓN: ¿Existe ya este dorsal en el equipo?
  const existingPlayer = await Player.findOne({
    team_id: coach.team_id,
    dorsal: dorsal,
    is_active: true, // Solo contamos jugadores activos
  });

  if (existingPlayer) {
    return res.status(400).json({ message: `El dorsal ${dorsal} ya está ocupado por ${existingPlayer.name}` });
  }

  const playerSlug = slugify(name) + "-" + Math.random().toString(36).substring(7);

  const newPlayer = await Player.create({
    name,
    slug: playerSlug,
    dorsal,
    role,
    image: image || "",
    team_id: coach.team_id,
  });

  res.status(201).json({ player: newPlayer.toPlayerResponse() });
});

// GET: Jugadores de un Coach
const getPlayersFromCoach = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const coach = await Coach.findOne({ slug });
  if (!coach) return res.status(404).json({ message: "Coach no encontrado" });

  const players = await Player.find({ team_id: coach.team_id, is_active: true });
  res.status(200).json({ players: players.map((p) => p.toPlayerResponse()) });
});

// GET: Jugadores de un Analista
const getPlayersFromAnalyst = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const analyst = await Analyst.findOne({ slug });
  if (!analyst) return res.status(404).json({ message: "Analista no encontrado" });

  const players = await Player.find({ team_id: analyst.team_id, is_active: true });
  res.status(200).json({ players: players.map((p) => p.toPlayerResponse()) });
});

// GET: Jugadores de un Equipo (basado en slug del equipo)
const getPlayersFromTeam = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const team = await Team.findOne({ slug });
  if (!team) return res.status(404).json({ message: "Equipo no encontrado" });

  const players = await Player.find({ team_id: team._id, is_active: true });
  res.status(200).json({ players: players.map((p) => p.toPlayerResponse()) });
});

const getPlayerBySlug = asyncHandler(async (req, res) => {
  const player = await Player.findOne({ slug: req.params.slug, is_active: true });
  if (!player) return res.status(404).json({ message: "Jugador no encontrado" });
  res.status(200).json({ player: player.toPlayerResponse() });
});

const updatePlayer = asyncHandler(async (req, res) => {
  const player = await Player.findOne({ slug: req.params.slug });
  if (!player) return res.status(404).json({ message: "Jugador no encontrado" });

  const updates = req.body;

  // VALIDACIÓN: Si se intenta cambiar el dorsal
  if (updates.dorsal !== undefined && updates.dorsal !== player.dorsal) {
    const dorsalOccupied = await Player.findOne({
      team_id: player.team_id,
      dorsal: updates.dorsal,
      _id: { $ne: player._id }, // Que no sea el mismo jugador
      is_active: true,
    });

    if (dorsalOccupied) {
      return res.status(400).json({
        message: `No se puede actualizar: el dorsal ${updates.dorsal} ya lo tiene ${dorsalOccupied.name}`,
      });
    }
  }

  const allowed = ["name", "dorsal", "role", "image", "status", "is_active"];
  allowed.forEach((field) => {
    if (updates[field] !== undefined) player[field] = updates[field];
  });

  await player.save();
  res.status(200).json({ player: player.toPlayerResponse() });
});

const deletePlayer = asyncHandler(async (req, res) => {
  const player = await Player.findOneAndUpdate({ slug: req.params.slug }, { is_active: false }, { new: true });
  if (!player) return res.status(404).json({ message: "Jugador no encontrado" });
  res.status(200).json({ message: "Jugador eliminado" });
});

module.exports = {
  createPlayer,
  getPlayersFromCoach,
  getPlayersFromAnalyst,
  getPlayersFromTeam,
  getPlayerBySlug,
  updatePlayer,
  deletePlayer,
};
