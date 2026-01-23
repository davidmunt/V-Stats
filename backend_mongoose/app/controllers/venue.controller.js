const asyncHandler = require("express-async-handler");
const Venue = require("../models/venue.model");
const slugify = require("slugify");

const createVenue = asyncHandler(async (req, res) => {
  const { name, address, city, capacity, indoor } = req.body;

  if (!name || !address || !city) {
    return res.status(400).json({ message: "Nombre, dirección y ciudad son obligatorios" });
  }

  const newVenue = await Venue.create({
    name,
    address,
    city,
    capacity: capacity || 0,
    indoor: indoor !== undefined ? indoor : true,
    id_admin: req.userId,
    status: "available",
    is_active: true,
  });

  // Usamos el método de respuesta
  res.status(201).json({ venue: newVenue.toVenueResponse() });
});

const getMyVenues = asyncHandler(async (req, res) => {
  const venues = await Venue.find({ id_admin: req.userId, is_active: true }).exec();
  // Mapeamos el array de resultados
  res.status(200).json({
    venues: venues.map((v) => v.toVenueResponse()),
  });
});

const getAllVenues = asyncHandler(async (req, res) => {
  const venues = await Venue.find({ is_active: true }).exec();
  // Mapeamos el array de resultados
  res.status(200).json({
    venues: venues.map((v) => v.toVenueResponse()),
  });
});

const getVenueBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const venue = await Venue.findOne({ slug, is_active: true }).exec();

  if (!venue) return res.status(404).json({ message: "Sede no encontrada" });
  res.status(200).json({ venue: venue.toVenueResponse() });
});

const updateVenue = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updates = req.body;

  const venue = await Venue.findOne({ slug, id_admin: req.userId });
  if (!venue) return res.status(404).json({ message: "Sede no encontrada o no tienes permiso" });

  const allowedUpdates = ["name", "address", "city", "capacity", "indoor", "status", "is_active"];
  allowedUpdates.forEach((key) => {
    if (updates[key] !== undefined) venue[key] = updates[key];
  });

  if (updates.name) {
    venue.slug = slugify(updates.name) + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }

  await venue.save();
  res.status(200).json({ venue: venue.toVenueResponse() });
});

const deleteVenue = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Solo el admin dueño puede eliminarla (borrado lógico)
  const venue = await Venue.findOneAndUpdate({ slug, id_admin: req.userId }, { is_active: false, status: "closed" }, { new: true });

  if (!venue) return res.status(404).json({ message: "Sede no encontrada o no tienes permiso" });
  res.status(200).json({ message: "Sede eliminada correctamente" });
});

module.exports = {
  createVenue,
  getMyVenues,
  getAllVenues,
  getVenueBySlug,
  updateVenue,
  deleteVenue,
};
