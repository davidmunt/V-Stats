const lineupController = require("../controllers/lineup.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Crear o actualizar alineación (Enviando array de posiciones)
  // Ahora usamos coachSlug en lugar de teamSlug
  app.post("/lineup/:matchSlug/:coachSlug", verifyJWT(["coach"]), lineupController.saveLineup);

  // Actualizar una posición específica (sustitución de jugador)
  app.put("/lineup/position/:positionSlug", verifyJWT(["coach"]), lineupController.updateLineupPosition);

  // CAMBIA :teamSlug POR :coachSlug
  app.get("/lineup/:matchSlug/:coachSlug", verifyJWT([]), lineupController.getLineupByTeam);

  // Obtener las alineaciones de AMBOS equipos de un partido
  app.get("/lineups/:matchSlug", verifyJWT([]), lineupController.getMatchLineups);
};
