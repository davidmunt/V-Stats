const asyncHandler = require("express-async-handler");
const League = require("../models/league.model");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");
const slugify = require("slugify");
const Match = require("../models/match.model");
const Team = require("../models/team.model");

// Crear Liga
const createLeague = asyncHandler(async (req, res) => {
  const { name, country, category, season, image } = req.body;
  if (!name || !country || !category || !season) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }
  const newLeague = await League.create({
    name,
    country,
    category,
    season,
    image: image || "",
    admin_id: req.userId, // ID del admin obtenido del token
  });
  res.status(201).json({ league: await newLeague.toLeagueResponse() });
});

// Obtener todas las ligas del Admin logueado
const getMyLeagues = asyncHandler(async (req, res) => {
  const leagues = await League.find({ admin_id: req.userId, is_active: true }).exec();
  const formattedLeagues = leagues.map((league) => ({
    id_league: league._id,
    slug: league.slug,
    id_category_league: league.category, // o league.category_league
    id_admin: league.admin_id, // o league.admin
    name: league.name,
    country: league.country,
    season: league.season,
    created_at: league.createdAt,
    updated_at: league.updatedAt,
    status: league.status,
    image: league.image,
    is_active: league.is_active,
  }));

  res.status(200).json({ leagues: formattedLeagues });
});

// Obtener una liga por Slug
const getLeagueBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Quitamos admin_id de la búsqueda para que el Coach pueda verla
  const league = await League.findOne({ slug, is_active: true }).populate("category").exec();

  if (!league) {
    return res.status(404).json({ message: "Liga no encontrada" });
  }

  res.status(200).json({ league: await league.toLeagueResponse() });
});

const getCoachLeague = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // 1. Buscamos al coach y poblamos el equipo y la liga en una sola cadena
  const coach = await Coach.findOne({ slug }).populate({
    path: "team_id",
    populate: {
      path: "league_id",
    },
  });

  if (!coach || !coach.team_id || !coach.team_id.league_id) {
    return res.status(404).json({ message: "No se encontró la liga para este coach" });
  }

  const league = coach.team_id.league_id;

  res.status(200).json({
    league: {
      id_league: league._id,
      name: league.name,
      slug: league.slug,
      description: league.description,
      image: league.image,
      start_date: league.start_date,
      end_date: league.end_date,
    },
  });
});

// Actualizar Liga
const updateLeague = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updates = req.body;
  // Si el nombre cambia, regeneramos el slug en el middleware (si así lo configuraste)
  // o lo manejamos aquí. Para mantener consistencia, buscamos y actualizamos:
  const league = await League.findOne({ slug, admin_id: req.userId });
  if (!league) {
    return res.status(404).json({ message: "Liga no encontrada" });
  }
  // Actualizar campos permitidos
  const allowedUpdates = ["name", "country", "category", "season", "status", "image", "is_active"];
  allowedUpdates.forEach((key) => {
    if (updates[key] !== undefined) league[key] = updates[key];
  });
  // Si el nombre cambió, forzamos un nuevo slug
  if (updates.name) {
    league.slug = slugify(updates.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  await league.save();
  res.status(200).json({ league: await league.toLeagueResponse() });
});

// Eliminar Liga (Borrado Lógico)
const deleteLeague = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const league = await League.findOneAndUpdate(
    { slug, admin_id: req.userId },
    { is_active: false }, // Recomendado hacer borrado lógico en vez de eliminar
    { new: true },
  );
  if (!league) {
    return res.status(404).json({ message: "Liga no encontrada" });
  }
  res.status(200).json({ message: "Liga eliminada correctamente" });
});

module.exports = {
  createLeague,
  getMyLeagues,
  getLeagueBySlug,
  getCoachLeague,
  updateLeague,
  deleteLeague,
};
