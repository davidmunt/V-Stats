module.exports = (app) => {
  const userController = require("../controllers/auth.controller");
  const verifyJWT = require("../middleware/verifyJWT");

  // Login User
  app.post("/auth/login", userController.userLogin);

  // Register new User
  app.post("/auth/register", userController.registerUser);

  // Refresh Token
  app.post("/auth/refresh", verifyJWT([]), userController.refreshToken);

  // Logout
  app.post("/auth/logout", verifyJWT([]), userController.logout);

  app.get("/auth/me", verifyJWT([]), userController.getMe);
};
