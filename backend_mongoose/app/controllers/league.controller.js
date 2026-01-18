const asyncHandler = require("express-async-handler");
const League = require("../models/league.model");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");
const slugify = require("slugify");

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
  const leagues = await League.find({ admin_id: req.userId, isActive: true }).populate("category").exec();

  const leaguesResponse = await Promise.all(leagues.map(async (league) => await league.toLeagueResponse()));

  res.status(200).json({ leagues: leaguesResponse });
});

// Obtener una liga por Slug
const getLeagueBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const league = await League.findOne({ slug, admin_id: req.userId, isActive: true }).populate("category").exec();

  if (!league) {
    return res.status(404).json({ message: "Liga no encontrada" });
  }

  res.status(200).json({ league: await league.toLeagueResponse() });
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
  const allowedUpdates = ["name", "country", "category", "season", "status", "image", "isActive"];
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
    { isActive: false }, // Recomendado hacer borrado lógico en vez de eliminar
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
  updateLeague,
  deleteLeague,
};
