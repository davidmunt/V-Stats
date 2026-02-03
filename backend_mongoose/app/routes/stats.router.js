const statsController = require("../controllers/stats.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Obtener todas las acciones/estadísticas de un equipo específico
  app.get("/stats/team/", verifyJWT(["admin", "coach", "analyst"]), statsController.getTeamActions);
};
