const matchController = require("../controllers/match.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Ahora acepta el slug en la URL: /match/la-liga-2...
  app.post("/match/:leagueSlug", verifyJWT(["admin"]), matchController.createMatch);

  app.get("/matches/:leagueSlug", verifyJWT([]), matchController.getMatchesByLeague);

  app.get("/match/:slug", verifyJWT([]), matchController.getMatchBySlug);

  // Obtener los partidos del equipo que entrena el coach
  app.get("/matches/coach/:slug", verifyJWT(["coach"]), matchController.getCoachMatches);

  app.get("/match/next/coach/:slug", verifyJWT(["coach"]), matchController.getNextMatch);

  app.get("/match/next/analyst/:slug", verifyJWT(["analyst"]), matchController.getNextMatchAnalyst);

  // Obtener toda la información necesaria para el panel de análisis
  app.get("/match/:matchSlug/teams", verifyJWT(["admin", "analyst"]), matchController.getMatchDataForAnalysis);

  // Cambiar estado a LIVE (seguro para múltiples analistas)
  app.patch("/match/:matchSlug/start", verifyJWT(["admin", "analyst"]), matchController.startMatch);

  app.put("/:leagueSlug/match/:matchSlug", verifyJWT(["admin"]), matchController.updateMatch);

  app.delete("/:leagueSlug/match/:matchSlug", verifyJWT(["admin"]), matchController.deleteMatch);
};
