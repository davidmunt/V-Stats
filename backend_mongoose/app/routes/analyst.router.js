const analystController = require("../controllers/analyst.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Obtener todos los analistas libres (sin equipo)
  app.get("/analysts/free", verifyJWT(["admin"]), analystController.getFreeAnalysts);

  // Obtener analista por slug
  app.get("/analyst/:slug", verifyJWT(["admin", "coach", "analyst"]), analystController.getAnalystBySlug);

  app.get("/analysts/assigned", verifyJWT(["admin"]), analystController.getAssignedAnalysts);
};
