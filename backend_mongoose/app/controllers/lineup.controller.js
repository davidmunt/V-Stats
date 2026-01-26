const asyncHandler = require("express-async-handler");
const Lineup = require("../models/lineup.model");
const LineupPosition = require("../models/lineupPosition.model");
const Match = require("../models/match.model");
const Team = require("../models/team.model");
const Player = require("../models/player.model");
const slugify = require("slugify");
const Coach = require("../models/coach.model");

const saveLineup = asyncHandler(async (req, res) => {
  const { matchSlug, coachSlug } = req.params; // Recibimos el slug del coach
  const { positions } = req.body;

  // 1. Buscamos el partido
  const match = await Match.findOne({ slug: matchSlug });
  if (!match) return res.status(404).json({ message: "Partido no encontrado" });

  // 2. Buscamos al Coach y obtenemos su Team ID
  const coach = await Coach.findOne({ slug: coachSlug });
  if (!coach || !coach.team_id) {
    return res.status(404).json({ message: "Coach no encontrado o no tiene equipo asignado" });
  }

  // El team_id real para la base de datos
  const teamId = coach.team_id;

  // 3. Validar posiciones obligatorias (1 a 6)
  const requiredPositions = [1, 2, 3, 4, 5, 6];
  const sentPositions = positions.map((p) => p.position);
  const hasAllRequired = requiredPositions.every((pos) => sentPositions.includes(pos));

  if (!hasAllRequired) {
    return res.status(400).json({ message: "Faltan posiciones obligatorias en pista (1 a 6)" });
  }

  // 4. Validar no repetir jugadores
  const playerIds = positions.map((p) => p.player_id);
  if (new Set(playerIds).size !== playerIds.length) {
    return res.status(400).json({ message: "No puedes repetir jugadores en la alineación" });
  }

  // 5. Buscar o crear la alineación (Lineup)
  let lineup = await Lineup.findOne({ match_id: match._id, team_id: teamId });

  if (!lineup) {
    lineup = await Lineup.create({
      // Usamos el slug del coach para el slug de la lineup también si quieres, o el del equipo
      slug: `lineup-${matchSlug}-${coachSlug}-${Math.random().toString(36).substring(7)}`,
      match_id: match._id,
      team_id: teamId,
      status: "starting",
    });
  } else {
    // Si ya existe, limpiamos las posiciones para la nueva configuración
    await LineupPosition.deleteMany({ lineup_id: lineup._id });
  }

  // 6. Crear las posiciones (1-6 en pista, 7 fuera)
  const lineupPositions = positions.map((p) => ({
    slug: `pos-${lineup.slug}-${p.position}-${Math.random().toString(36).substring(7)}`,
    lineup_id: lineup._id,
    player_id: p.player_id,
    initial_position: p.position,
    current_position: p.position,
    is_on_court: p.position !== 7, // El 7 es el reserva/líbero fuera de pista
  }));

  await LineupPosition.insertMany(lineupPositions);

  res.status(201).json({
    message: "Alineación guardada correctamente mediante Coach",
    lineup: lineup.toLineupResponse(), // <--- CAMBIO AQUÍ
  });
});

// UPDATE INDIVIDUAL: Para cambiar un jugador específico por otro antes de empezar
const updateLineupPosition = asyncHandler(async (req, res) => {
  const { positionSlug } = req.params;
  const { player_id } = req.body; // Solo permitimos cambiar el jugador en esta fase

  // 1. Buscar la posición en el campo (ej: zona 4)
  const position = await LineupPosition.findOne({ slug: positionSlug });
  if (!position) return res.status(404).json({ message: "Posición no encontrada" });

  // 2. Validar que el nuevo jugador no esté ya en otra posición del campo
  const isPlayerBusy = await LineupPosition.findOne({
    lineup_id: position.lineup_id,
    player_id: player_id,
    _id: { $ne: position._id },
  });

  if (isPlayerBusy) {
    return res.status(400).json({ message: "Este jugador ya está asignado a otra posición en el campo" });
  }

  // 3. Actualizar el jugador
  position.player_id = player_id;
  await position.save();

  const updatedPosition = await LineupPosition.findById(position._id).populate("player_id", "name dorsal role image");

  res.status(200).json({
    message: "Titular modificado correctamente",
    position: updatedPosition,
  });
});

const getLineupByTeam = asyncHandler(async (req, res) => {
  const { matchSlug, coachSlug } = req.params;

  // 1. Buscamos el partido
  const match = await Match.findOne({ slug: matchSlug });

  // 2. Buscamos el coach
  const coach = await Coach.findOne({ slug: coachSlug });

  // --- LOG DE DEPURACIÓN ---
  if (!match || !coach) {
    return res.status(404).json({
      message: "Datos no encontrados",
      debug: {
        matchSlugRecibido: matchSlug,
        matchEncontrado: !!match,
        coachSlugRecibido: coachSlug,
        coachEncontrado: !!coach,
      },
    });
  }

  // 3. Buscamos la alineación usando el ID del equipo del coach
  const lineup = await Lineup.findOne({
    match_id: match._id,
    team_id: coach.team_id,
    is_active: true,
  });

  if (!lineup) return res.status(404).json({ message: "Alineación no definida para este equipo" });

  const positions = await LineupPosition.find({ lineup_id: lineup._id, is_active: true })
    .populate("player_id", "name dorsal role image")
    .sort({ current_position: 1 });

  const formattedPositions = positions.map((pos) => ({
    id_lineup_position: pos._id,
    slug: pos.slug,
    initial_position: pos.initial_position,
    current_position: pos.current_position,
    is_on_court: pos.is_on_court,
    player: pos.player_id
      ? {
          id_player: pos.player_id._id,
          name: pos.player_id.name,
          dorsal: pos.player_id.dorsal,
          role: pos.player_id.role,
          image: pos.player_id.image,
        }
      : null,
  }));

  res.status(200).json({
    lineup: lineup.toLineupResponse(),
    positions: formattedPositions,
  });
});

const getMatchLineups = asyncHandler(async (req, res) => {
  const { matchSlug } = req.params;
  const match = await Match.findOne({ slug: matchSlug });

  const lineups = await Lineup.find({ match_id: match._id, is_active: true }).populate("team_id", "name slug image");

  const fullLineups = await Promise.all(
    lineups.map(async (l) => {
      const pos = await LineupPosition.find({ lineup_id: l._id, is_active: true }).populate("player_id", "name dorsal role");
      return { ...l.toObject(), positions: pos };
    }),
  );

  res.status(200).json({ lineups: fullLineups });
});

module.exports = { saveLineup, updateLineupPosition, getLineupByTeam, getMatchLineups };
