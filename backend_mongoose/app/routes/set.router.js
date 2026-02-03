const setController = require("../controllers/set.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Obtener el set actual de un partido (el número de set más alto)
  app.get("/set-match/:matchSlug", verifyJWT(["admin", "analyst", "coach"]), setController.getActualSetFromMatch);
};
