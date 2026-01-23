const coachController = require("../controllers/coach.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Obtener todos los coaches libres (sin equipo)
  app.get("/coaches/free", verifyJWT(["admin"]), coachController.getFreeCoaches);

  // Obtener coach por slug
  app.get("/coach/:slug", verifyJWT(["admin", "coach", "analyst"]), coachController.getCoachBySlug);

  app.get("/coaches/assigned", verifyJWT(["admin"]), coachController.getAssignedCoaches);
};
