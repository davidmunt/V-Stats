const asyncHandler = require("express-async-handler");
const Action = require("../models/action.model");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");

const getTeamActions = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;
  let teamId = "";
  if (userRole === "coach") {
    teamId = await Coach.findById(userId).then((user) => user.team_id);
  } else if (userRole === "analyst") {
    teamId = await Analyst.findById(userId).then((user) => user.team_id);
  }

  const actions = await Action.find({
    team_id: teamId,
    is_active: true,
  })
    .populate("player_id", "name dorsal role")
    .populate("set_id", "set_number")
    .sort({ createdAt: -1 });

  const formattedActions = actions.map((action) => ({
    id_match: action.match_id,
    id_set: action.set_id ? action.set_id._id : null,
    set_number: action.set_id ? action.set_id.set_number : null,
    id_team: action.team_id,
    id_player: action.player_id ? action.player_id._id : null,
    player_name: action.player_id ? action.player_id.name : "N/A",
    player_dorsal: action.player_id ? action.player_id.dorsal : null,
    player_position: action.player_position,
    action_type: action.action_type,
    result: action.result,
    id_point_for_team: action.point_for_team_id,
    start_x: action.start_x,
    start_y: action.start_y,
    end_x: action.end_x,
    end_y: action.end_y,
    timestamp: action.createdAt,
  }));

  res.status(200).json({
    total_actions: formattedActions.length,
    team_id: teamId,
    actions: formattedActions,
  });
});

module.exports = { getTeamActions };
