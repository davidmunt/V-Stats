const teamController = require("../controllers/team.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  app.post("/team", verifyJWT(["admin"]), teamController.createTeam);

  app.get("/league/:leagueSlug/teams", verifyJWT(["admin", "coach"]), teamController.getTeamsByLeague);

  app.get("/team/:slug", verifyJWT(["admin", "coach"]), teamController.getTeamBySlug);

  app.get("/my-team", verifyJWT(["coach", "analyst"]), teamController.getMyAssignedTeam);

  app.put("/team/:slug", verifyJWT(["admin"]), teamController.updateTeam);

  app.delete("/team/:slug", verifyJWT(["admin"]), teamController.deleteTeam);

  app.put("/team/:slug/assign-coach", verifyJWT(["admin"]), teamController.assignCoach);

  app.put("/team/:slug/assign-analyst", verifyJWT(["admin"]), teamController.assignAnalyst);

  // Obtener la tabla de posiciones de una liga
  app.get("/league/:leagueSlug/standings", teamController.getLeagueStandings);
};
