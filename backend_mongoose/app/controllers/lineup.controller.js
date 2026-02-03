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

const substitutePlayer = asyncHandler(async (req, res) => {
  const { id_lineup, id_player_out, id_player_in } = req.body;

  // 1. Buscamos las posiciones de ambos jugadores en esa alineación específica
  const posOut = await LineupPosition.findOne({ lineup_id: id_lineup, player_id: id_player_out, is_active: true });
  const posIn = await LineupPosition.findOne({ lineup_id: id_lineup, player_id: id_player_in, is_active: true });

  if (!posOut || !posIn) {
    return res.status(404).json({ message: "Uno o ambos jugadores no se encuentran en esta alineación." });
  }

  // 2. Intercambiamos sus posiciones actuales (current_position)
  // Guardamos la del que sale para dársela al que entra
  const tempPosition = posOut.current_position;
  const tempOnCourt = posOut.is_on_court;

  posOut.current_position = posIn.current_position;
  posOut.is_on_court = posIn.is_on_court;

  posIn.current_position = tempPosition;
  posIn.is_on_court = tempOnCourt;

  // 3. Guardamos los cambios
  await posOut.save();
  await posIn.save();

  // 4. (Opcional) Aquí podrías crear una "Action" de tipo "substitution" para el historial
  // await Action.create({ ... tipo_accion: "substitution", id_player: id_player_in, etc });

  res.status(200).json({
    message: "Sustitución realizada con éxito",
    player_in: {
      id_player: id_player_in,
      new_position: posIn.current_position,
      is_on_court: posIn.is_on_court,
    },
    player_out: {
      id_player: id_player_out,
      new_position: posOut.current_position,
      is_on_court: posOut.is_on_court,
    },
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

  // 3. Buscamos la alineación
  const lineup = await Lineup.findOne({
    match_id: match._id,
    team_id: coach.team_id,
    is_active: true,
  });

  // --- CORRECCIÓN AQUÍ ---
  // Si no existe la alineación, NO devolvemos error.
  // Devolvemos un 200 con todo vacío para que el frontend no falle.
  if (!lineup) {
    return res.status(200).json({
      lineup: null,
      positions: [],
    });
  }
  // -----------------------

  const positions = await LineupPosition.find({ lineup_id: lineup._id, is_active: true })
    .populate("player_id", "name dorsal role image")
    .sort({ current_position: 1 });

  // Formateo APLANADO (Player al mismo nivel, como pediste antes)
  const formattedPositions = positions.map((pos) => {
    const player = pos.player_id;
    return {
      id_lineup_position: pos._id,
      slug: pos.slug,
      initial_position: pos.initial_position,
      current_position: pos.current_position,
      is_on_court: pos.is_on_court,
      // Datos del jugador planos (si player es null, devolvemos nulls)
      id_player: player ? player._id : null,
      name: player ? player.name : null,
      dorsal: player ? player.dorsal : null,
      role: player ? player.role : null,
      image: player ? player.image : null,
    };
  });

  res.status(200).json({
    lineup: lineup.toLineupResponse(),
    positions: formattedPositions,
  });
});

const getMatchLineups = asyncHandler(async (req, res) => {
  const { matchSlug } = req.params;

  // 1. Buscamos el partido
  const match = await Match.findOne({ slug: matchSlug });
  if (!match) return res.status(404).json({ message: "Partido no encontrado" });

  // 2. Buscamos las alineaciones (Sin popular el equipo, para tener solo el ID)
  const lineups = await Lineup.find({ match_id: match._id, is_active: true });

  // 3. Helper para formatear posiciones
  const getFormattedPositions = async (lineupId) => {
    const positions = await LineupPosition.find({ lineup_id: lineupId, is_active: true })
      // --- CAMBIO IMPORTANTE ---
      // Añadimos 'team_id' a la lista. Si no lo pones aquí, Mongoose no lo trae.
      .populate("player_id", "name dorsal role image team_id")
      .sort({ current_position: 1 });

    return positions.map((pos) => {
      const player = pos.player_id;

      return {
        id_lineup_position: pos._id,
        slug: pos.slug,
        initial_position: pos.initial_position,
        current_position: pos.current_position,
        is_on_court: pos.is_on_court,

        // --- DATOS APLANADOS (FLAT) ---
        id_player: player ? player._id : null,
        // Aquí accedemos a team_id porque ya lo incluimos en el populate
        id_team: player ? player.team_id : null,
        dorsal: player ? player.dorsal : null,
        name: player ? player.name : null,
        role: player ? player.role : null,
        image: player ? player.image : null,
      };
    });
  };

  // 4. Separamos en Home y Away
  let homeLineup = null;
  let awayLineup = null;

  for (const lineup of lineups) {
    const teamId = String(lineup.team_id); // Al no popular, esto es directamente el ID
    const positions = await getFormattedPositions(lineup._id);

    const formattedLineup = {
      id_lineup: lineup._id,
      slug: lineup.slug,
      id_match: lineup.match_id,
      status: lineup.status,
      is_active: lineup.is_active,
      id_team: lineup.team_id, // Solo el ID, no el objeto
      positions: positions,
    };

    if (teamId === String(match.local_team_id)) {
      homeLineup = formattedLineup;
    } else if (teamId === String(match.visitor_team_id)) {
      awayLineup = formattedLineup;
    }
  }

  // 5. Respuesta
  res.status(200).json({
    lineups: {
      home: homeLineup,
      away: awayLineup,
    },
  });
});

module.exports = { saveLineup, substitutePlayer, updateLineupPosition, getLineupByTeam, getMatchLineups };
