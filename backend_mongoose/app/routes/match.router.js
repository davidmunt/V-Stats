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

  app.put("/:leagueSlug/match/:matchSlug", verifyJWT(["admin"]), matchController.updateMatch);

  app.delete("/:leagueSlug/match/:matchSlug", verifyJWT(["admin"]), matchController.deleteMatch);
};
