const playerController = require("../controllers/player.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Operaciones básicas
  app.post("/player", verifyJWT(["admin", "coach"]), playerController.createPlayer);
  app.get("/player/:slug", verifyJWT([]), playerController.getPlayerBySlug);
  app.put("/player/:slug", verifyJWT(["admin", "coach"]), playerController.updatePlayer);
  app.delete("/player/:slug", verifyJWT(["admin", "coach"]), playerController.deletePlayer);

  // Consultas por relaciones
  app.get("/team/:slug/players", verifyJWT([]), playerController.getPlayersFromTeam);
  app.get("/coach/:slug/players", verifyJWT([]), playerController.getPlayersFromCoach);
  app.get("/analyst/:slug/players", verifyJWT([]), playerController.getPlayersFromAnalyst);
};
