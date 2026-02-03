const actionController = require("../controllers/action.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  app.post("/set/:slug/action", verifyJWT(["analyst"]), actionController.createAction);
  app.delete("/set/:slug/:teamSlug/action", verifyJWT(["analyst"]), actionController.cancelLastAction);
};
