const asyncHandler = require("express-async-handler");
const Team = require("../models/team.model");
const League = require("../models/league.model");
const slugify = require("slugify");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");

// Crear Equipo
const createTeam = asyncHandler(async (req, res) => {
  const { name, league_id, logo, city } = req.body;

  if (!name || !league_id) {
    return res.status(400).json({ message: "Nombre y League ID son obligatorios" });
  }

  // 1. Verificar que la liga existe y pertenece al admin actual
  const league = await League.findOne({ _id: league_id, admin_id: req.userId });
  if (!league) {
    return res.status(403).json({ message: "No tienes permiso para añadir equipos a esta liga" });
  }

  const newTeam = await Team.create({
    name,
    league_id,
    logo: logo || "",
    city: city || "",
    admin_id: req.userId, // Guardamos quién lo creó para facilitar filtros
  });

  res.status(201).json({ team: await newTeam.toTeamResponse() });
});

// Obtener equipos de una liga
const getTeamsByLeague = asyncHandler(async (req, res) => {
  const { leagueSlug } = req.params;

  // 1. Encontrar la liga y validar propiedad
  const league = await League.findOne({ slug: leagueSlug, admin_id: req.userId });
  if (!league) {
    return res.status(404).json({ message: "Liga no encontrada o no tienes acceso" });
  }

  // 2. Buscar equipos de esa liga
  const teams = await Team.find({ league_id: league._id, isActive: true }).exec();

  const teamsResponse = await Promise.all(teams.map(async (team) => await team.toTeamResponse()));

  res.status(200).json({ teams: teamsResponse });
});

// Obtener equipo por Slug
const getTeamBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const team = await Team.findOne({ slug, admin_id: req.userId, isActive: true }).exec();

  if (!team) {
    return res.status(404).json({ message: "Equipo no encontrado" });
  }

  res.status(200).json({ team: await team.toTeamResponse() });
});

const getMyAssignedTeam = asyncHandler(async (req, res) => {
  let userProfile = null;

  // 1. Buscar al usuario según su rol para obtener el team_id
  if (req.userRole === "coach") {
    userProfile = await Coach.findById(req.userId).exec();
  } else if (req.userRole === "analyst") {
    userProfile = await Analyst.findById(req.userId).exec();
  }

  if (!userProfile || !userProfile.team_id) {
    return res.status(404).json({
      message: "No tienes un equipo asignado todavía. Contacta con tu administrador.",
    });
  }

  // 2. Buscar los detalles del equipo
  const team = await Team.findById(userProfile.team_id)
    .populate("league_id", "name slug") // Traemos info básica de la liga
    .exec();

  if (!team || !team.isActive) {
    return res.status(404).json({ message: "Equipo no encontrado o inactivo" });
  }

  res.status(200).json({
    team: await team.toTeamResponse(),
    role_in_team: req.userRole,
  });
});

// Actualizar Equipo
const updateTeam = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updates = req.body;

  const team = await Team.findOne({ slug, admin_id: req.userId });

  if (!team) {
    return res.status(404).json({ message: "Equipo no encontrado" });
  }

  const allowedUpdates = ["name", "logo", "city", "status", "isActive"];
  allowedUpdates.forEach((key) => {
    if (updates[key] !== undefined) team[key] = updates[key];
  });

  if (updates.name) {
    team.slug = slugify(updates.name) + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }

  await team.save();
  res.status(200).json({ team: await team.toTeamResponse() });
});

// Eliminar Equipo (Borrado Lógico)
const deleteTeam = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const team = await Team.findOneAndUpdate({ slug, admin_id: req.userId }, { isActive: false }, { new: true });

  if (!team) {
    return res.status(404).json({ message: "Equipo no encontrado" });
  }

  res.status(200).json({ message: "Equipo eliminado correctamente" });
});

const assignCoach = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { email } = req.body;

  const team = await Team.findOne({ slug, admin_id: req.userId });
  if (!team) return res.status(404).json({ message: "Equipo no encontrado" });

  const coach = await Coach.findOne({ email });
  if (!coach) return res.status(404).json({ message: "Entrenador no encontrado" });
  if (coach.team_id) return res.status(409).json({ message: "El entrenador ya tiene equipo" });

  coach.team_id = team._id;
  await coach.save();

  res.status(200).json({ message: "Entrenador asignado", coach: coach.name });
});

const assignAnalyst = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { email } = req.body;

  const team = await Team.findOne({ slug, admin_id: req.userId });
  if (!team) return res.status(404).json({ message: "Equipo no encontrado" });

  const analyst = await Analyst.findOne({ email });
  if (!analyst) return res.status(404).json({ message: "Analista no encontrado" });
  if (analyst.team_id) return res.status(409).json({ message: "El analista ya tiene equipo" });

  analyst.team_id = team._id;
  await analyst.save();

  res.status(200).json({ message: "Analista asignado", analyst: analyst.name });
});

module.exports = {
  createTeam,
  getTeamsByLeague,
  getTeamBySlug,
  getMyAssignedTeam,
  updateTeam,
  deleteTeam,
  assignCoach,
  assignAnalyst,
};
