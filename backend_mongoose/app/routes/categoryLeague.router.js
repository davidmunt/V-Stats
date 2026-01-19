const categoryController = require("../controllers/categoryLeague.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  app.post("/categories", verifyJWT(["admin"]), categoryController.createCategory);

  app.get("/categories/my-categories", verifyJWT([]), categoryController.getAllCategories);

  app.get("/categories/:slug", verifyJWT([]), categoryController.getCategoryBySlug);

  app.put("/categories/:slug", verifyJWT(["admin"]), categoryController.updateCategory);

  app.delete("/categories/:slug", verifyJWT(["admin"]), categoryController.deleteCategory);
};
