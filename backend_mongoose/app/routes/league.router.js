const leagueController = require("../controllers/league.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Crear una liga (Solo Admin)
  app.post("/leagues", verifyJWT(["admin"]), leagueController.createLeague);

  // Obtener todas las ligas del admin autenticado (Solo Admin)
  app.get("/leagues", verifyJWT(["admin"]), leagueController.getMyLeagues);

  // Obtener una liga por slug (Solo Admin)
  app.get("/leagues/:slug", verifyJWT(["admin"]), leagueController.getLeagueBySlug);

  // Actualizar una liga (Solo Admin)
  app.put("/leagues/:slug", verifyJWT(["admin"]), leagueController.updateLeague);

  // Eliminar una liga (Solo Admin)
  app.delete("/leagues/:slug", verifyJWT(["admin"]), leagueController.deleteLeague);
};
