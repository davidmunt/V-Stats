const asyncHandler = require("express-async-handler");
const Action = require("../models/action.model");
const SetModel = require("../models/set.model");
const Team = require("../models/team.model");
const Match = require("../models/match.model");
const Lineup = require("../models/lineup.model");
const LineupPosition = require("../models/lineupPosition.model");

const createAction = asyncHandler(async (req, res) => {
  const { slug: setSlug } = req.params;
  const data = req.body;

  const currentSet = await SetModel.findOne({ slug: setSlug }).populate("match_id");
  if (!currentSet) return res.status(404).json({ message: "Set no encontrado" });

  const match = currentSet.match_id;
  if (match.status === "finished") {
    return res.status(400).json({ message: "El partido ha finalizado." });
  }

  const actionSlug = `act-${Math.random().toString(36).substring(2, 8)}`;
  const actionData = {
    slug: actionSlug,
    match_id: match._id,
    set_id: currentSet._id,
    team_id: data.id_team || data.id_point_for_team,
    player_id: data.id_player || null,
    player_position: data.player_position || null,
    action_type: data.action_type,
    result: data.result || null,
    point_for_team_id: data.id_point_for_team || null,
    start_x: data.start_x || 0,
    start_y: data.start_y || 0,
    end_x: data.end_x || 0,
    end_y: data.end_y || 0,
  };

  const newAction = await Action.create(actionData);

  let matchFinished = false;
  let nextSet = null;

  if (data.id_point_for_team) {
    // --- LÓGICA DE ROTACIÓN ---
    // 1. Buscamos la última acción de este set que generó un punto (excluyendo la actual)
    const lastPointAction = await Action.findOne({
      set_id: currentSet._id,
      point_for_team_id: { $ne: null },
      _id: { $ne: newAction._id },
    }).sort({ createdAt: -1 });

    // 2. ¿Debemos rotar?
    // Si NO hay acción anterior, el equipo que gana el primer punto NO rota (regla oficial si sacaba él).
    // Si HAY acción anterior y el equipo que ganó el anterior es DISTINTO al de ahora, toca rotar.
    if (lastPointAction && String(lastPointAction.point_for_team_id) !== String(data.id_point_for_team)) {
      // Buscamos la alineación activa del equipo que acaba de ganar el punto
      const teamLineup = await Lineup.findOne({
        match_id: match._id,
        team_id: data.id_point_for_team,
        is_active: true,
      });

      if (teamLineup) {
        // Obtenemos las posiciones de pista (1 a 6, ignoramos la 7 que suele ser Líbero/Reserva)
        const positionsToRotate = await LineupPosition.find({
          lineup_id: teamLineup._id,
          current_position: { $gte: 1, $lte: 6 },
          is_active: true,
        });

        // Aplicamos la rotación: 1->6, 6->5, 5->4, 4->3, 3->2, 2->1
        for (let pos of positionsToRotate) {
          let nextPos;
          if (pos.current_position === 1) nextPos = 6;
          else if (pos.current_position === 6) nextPos = 5;
          else if (pos.current_position === 5) nextPos = 4;
          else if (pos.current_position === 4) nextPos = 3;
          else if (pos.current_position === 3) nextPos = 2;
          else if (pos.current_position === 2) nextPos = 1;

          pos.current_position = nextPos;
          await pos.save();
        }
      }
    }
    // --- FIN LÓGICA DE ROTACIÓN ---

    // A. Sumar punto al marcador
    const isLocalPoint = String(data.id_point_for_team) === String(match.local_team_id);
    if (isLocalPoint) currentSet.local_points += 1;
    else currentSet.visitor_points += 1;

    // B. Comprobar fin de SET / PARTIDO (Tu lógica anterior corregida)
    const pointsToWin = currentSet.set_number === 5 ? 15 : 25;
    const diff = Math.abs(currentSet.local_points - currentSet.visitor_points);
    const isSetWon = (currentSet.local_points >= pointsToWin || currentSet.visitor_points >= pointsToWin) && diff >= 2;

    if (isSetWon) {
      currentSet.status = "finished";
      currentSet.finished_at = new Date();
      await currentSet.save();

      const finishedSets = await SetModel.find({ match_id: match._id, status: "finished" });
      let localSetsWon = 0;
      let visitorSetsWon = 0;
      finishedSets.forEach((s) => {
        if (s.local_points > s.visitor_points) localSetsWon++;
        else visitorSetsWon++;
      });

      if (localSetsWon === 3 || visitorSetsWon === 3) {
        matchFinished = true;
        match.status = "finished";
        match.winner_team_id = localSetsWon === 3 ? match.local_team_id : match.visitor_team_id;
        await match.save();
      } else {
        const nextSetNumber = currentSet.set_number + 1;
        if (nextSetNumber <= 5) {
          nextSet = await SetModel.create({
            slug: `set-${nextSetNumber}-${match.slug}-${Math.random().toString(36).substring(7)}`,
            match_id: match._id,
            set_number: nextSetNumber,
            local_points: 0,
            visitor_points: 0,
            status: "in_progress",
            is_active: true,
          });
        }
      }
    } else {
      await currentSet.save();
    }
  }

  res.status(201).json({
    action: newAction.toActionResponse(),
    set: currentSet.toSetResponse(),
    new_set: nextSet ? nextSet.toSetResponse() : null,
    match_finished: matchFinished,
    match_status: match.status,
  });
});

const cancelLastAction = asyncHandler(async (req, res) => {
  const { slug: setSlug, teamSlug } = req.params;

  // 1. Encontrar el Set y el Equipo
  const currentSet = await SetModel.findOne({ slug: setSlug }).populate("match_id");
  const team = await Team.findOne({ slug: teamSlug });

  if (!currentSet || !team) return res.status(404).json({ message: "Set o Equipo no encontrado" });

  // 2. Buscar la ÚLTIMA acción de ese equipo en este set que haya sido un punto
  const lastAction = await Action.findOne({
    set_id: currentSet._id,
    point_for_team_id: team._id,
    is_active: true,
  }).sort({ createdAt: -1 });

  if (!lastAction) {
    return res.status(400).json({ message: "No hay acciones para deshacer" });
  }

  // 3. Borrado lógico o físico (tú decides, aquí lo borramos)
  await Action.findByIdAndDelete(lastAction._id);

  // 4. Restar el punto en el Set
  const match = currentSet.match_id;
  if (String(team._id) === String(match.local_team_id)) {
    currentSet.local_points = Math.max(0, currentSet.local_points - 1);
  } else {
    currentSet.visitor_points = Math.max(0, currentSet.visitor_points - 1);
  }

  await currentSet.save();

  res.status(200).json({
    message: "Acción cancelada",
    set: currentSet.toSetResponse(),
  });
});

module.exports = { createAction, cancelLastAction };
