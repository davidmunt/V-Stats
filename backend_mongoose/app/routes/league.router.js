const leagueController = require("../controllers/league.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Crear una liga (Solo Admin)
  app.post("/league", verifyJWT(["admin"]), leagueController.createLeague);

  // Obtener todas las ligas del admin autenticado (Solo Admin)
  app.get("/league/my-leagues", verifyJWT(["admin"]), leagueController.getMyLeagues);

  // Obtener una liga por slug (Solo Admin)
  app.get("/league/:slug", verifyJWT(["admin", "coach"]), leagueController.getLeagueBySlug);

  // Obtener la información de la liga a la que pertenece el equipo del coach
  app.get("/league/coach/:slug", verifyJWT(["coach"]), leagueController.getCoachLeague);

  // Actualizar una liga (Solo Admin)
  app.put("/league/:slug", verifyJWT(["admin"]), leagueController.updateLeague);

  // Eliminar una liga (Solo Admin)
  app.delete("/league/:slug", verifyJWT(["admin"]), leagueController.deleteLeague);
};
