const asyncHandler = require("express-async-handler");
const SetModel = require("../models/set.model");
const Match = require("../models/match.model");

const getActualSetFromMatch = asyncHandler(async (req, res) => {
  const { matchSlug } = req.params;

  // 1. Buscamos el partido
  const match = await Match.findOne({ slug: matchSlug });
  if (!match) {
    return res.status(404).json({ message: "Partido no encontrado" });
  }

  // 2. Intentamos buscar el set más reciente
  let currentSet = await SetModel.findOne({
    match_id: match._id,
    is_active: true,
  }).sort({ set_number: -1 });

  // 3. Si no existe ningún set, lo creamos automáticamente
  if (!currentSet) {
    const setSlug = `set-1-${matchSlug}-${Math.random().toString(36).substring(7)}`;

    currentSet = await SetModel.create({
      slug: setSlug,
      match_id: match._id,
      set_number: 1,
      local_points: 0,
      visitor_points: 0,
      status: "in_progress", // Usamos tu enum in_progress
    });
  }

  // 4. Devolvemos el set (ya sea el encontrado o el recién creado)
  res.status(200).json({
    set: currentSet.toSetResponse(),
  });
});

const getFinishedSetsByMatch = asyncHandler(async (req, res) => {
  const { matchSlug } = req.params;

  // 1. Buscamos el partido para obtener su _id
  const match = await Match.findOne({ slug: matchSlug });
  if (!match) {
    return res.status(404).json({ message: "Partido no encontrado" });
  }

  // 2. Buscamos los sets que NO están "in_progress"
  // Usamos $ne para traer "finished", "canceled", etc.
  const sets = await SetModel.find({
    match_id: match._id,
    status: { $ne: "in_progress" },
    is_active: true,
  }).sort({ set_number: 1 }); // Ordenados del primero al último

  // 3. Formateamos la respuesta usando tu método toSetResponse
  const formattedSets = sets.map((s) => s.toSetResponse());

  res.status(200).json({
    id_match: match._id,
    total_finished: formattedSets.length,
    sets: formattedSets,
  });
});

module.exports = {
  getActualSetFromMatch,
  getFinishedSetsByMatch,
};
