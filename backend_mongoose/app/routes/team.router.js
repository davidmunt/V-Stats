const teamController = require("../controllers/team.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  app.post("/teams", verifyJWT(["admin"]), teamController.createTeam);

  app.get("/leagues/:leagueSlug/teams", verifyJWT(["admin"]), teamController.getTeamsByLeague);

  app.get("/teams/:slug", verifyJWT(["admin"]), teamController.getTeamBySlug);

  app.get("/my-team", verifyJWT(["coach", "analyst"]), teamController.getMyAssignedTeam);

  app.put("/teams/:slug", verifyJWT(["admin"]), teamController.updateTeam);

  app.delete("/teams/:slug", verifyJWT(["admin"]), teamController.deleteTeam);

  app.put("/teams/:slug/assign-coach", verifyJWT(["admin"]), teamController.assignCoach);

  app.put("/teams/:slug/assign-analyst", verifyJWT(["admin"]), teamController.assignAnalyst);
};
