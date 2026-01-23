const asyncHandler = require("express-async-handler");
const Coach = require("../models/coach.model");

// Función auxiliar para formatear la respuesta del Coach
const formatCoachResponse = (coach) => ({
  id_coach: coach._id,
  name: coach.name,
  email: coach.email,
  avatar: coach.avatar,
  team_id: coach.team_id,
  dark_mode: coach.dark_mode,
  status: coach.status,
  is_active: coach.is_active,
  slug: coach.slug,
});

const getFreeCoaches = asyncHandler(async (req, res) => {
  const coaches = await Coach.find({
    team_id: null,
    is_active: true,
  }).exec();

  res.status(200).json({
    coaches: coaches.map((coach) => formatCoachResponse(coach)),
  });
});

const getCoachBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const coach = await Coach.findOne({ slug, is_active: true }).exec();

  if (!coach) {
    return res.status(404).json({ message: "Entrenador no encontrado" });
  }

  res.status(200).json({ coach: formatCoachResponse(coach) });
});

const getAssignedCoaches = asyncHandler(async (req, res) => {
  // Buscamos coaches cuyo team_id NO sea nulo
  const coaches = await Coach.find({
    team_id: { $ne: null },
    is_active: true,
  })
    .populate("team_id", "name slug") // Traemos info básica del equipo
    .exec();

  const response = coaches.map((coach) => ({
    id_coach: coach._id,
    name: coach.name,
    email: coach.email,
    avatar: coach.avatar,
    status: coach.status,
    slug: coach.slug,
    // Añadimos información del equipo asignado
    team: coach.team_id
      ? {
          id_team: coach.team_id._id,
          name: coach.team_id.name,
          slug: coach.team_id.slug,
        }
      : null,
  }));

  res.status(200).json({ coaches: response });
});

module.exports = { getFreeCoaches, getCoachBySlug, getAssignedCoaches };
