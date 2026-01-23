const asyncHandler = require("express-async-handler");
const Analyst = require("../models/analyst.model");

// Función auxiliar para formatear la respuesta del Analista
const formatAnalystResponse = (analyst) => ({
  id_analyst: analyst._id,
  name: analyst.name,
  email: analyst.email,
  avatar: analyst.avatar,
  team_id: analyst.team_id,
  dark_mode: analyst.dark_mode,
  status: analyst.status,
  is_active: analyst.is_active,
  slug: analyst.slug,
});

const getFreeAnalysts = asyncHandler(async (req, res) => {
  const analysts = await Analyst.find({
    team_id: null,
    is_active: true,
  }).exec();

  res.status(200).json({
    analysts: analysts.map((analyst) => formatAnalystResponse(analyst)),
  });
});

const getAnalystBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const analyst = await Analyst.findOne({ slug, is_active: true }).exec();

  if (!analyst) {
    return res.status(404).json({ message: "Analista no encontrado" });
  }

  res.status(200).json({ analyst: formatAnalystResponse(analyst) });
});

const getAssignedAnalysts = asyncHandler(async (req, res) => {
  const analysts = await Analyst.find({
    team_id: { $ne: null },
    is_active: true,
  })
    .populate("team_id", "name slug")
    .exec();

  const response = analysts.map((analyst) => ({
    id_analyst: analyst._id,
    name: analyst.name,
    email: analyst.email,
    avatar: analyst.avatar,
    status: analyst.status,
    slug: analyst.slug,
    team: analyst.team_id
      ? {
          id_team: analyst.team_id._id,
          name: analyst.team_id.name,
          slug: analyst.team_id.slug,
        }
      : null,
  }));

  res.status(200).json({ analysts: response });
});

module.exports = { getFreeAnalysts, getAnalystBySlug, getAssignedAnalysts };
