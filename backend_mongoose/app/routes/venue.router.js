const venueController = require("../controllers/venue.controller");
const verifyJWT = require("../middleware/verifyJWT");

module.exports = (app) => {
  // Crear sede (Solo Admin)
  app.post("/venue", verifyJWT(["admin"]), venueController.createVenue);

  // Obtener mis sedes (Solo Admin - las que él creó)
  app.get("/venues/my-venues", verifyJWT(["admin"]), venueController.getMyVenues);

  // Obtener todas las sedes activas (Cualquier usuario logueado)
  app.get("/venue", verifyJWT([]), venueController.getAllVenues);

  // Obtener una por slug (Cualquier usuario logueado)
  app.get("/venue/:slug", verifyJWT([]), venueController.getVenueBySlug);

  // Modificar sede (Solo Admin - dueño)
  app.put("/venue/:slug", verifyJWT(["admin"]), venueController.updateVenue);

  // Eliminar sede (Solo Admin - dueño)
  app.delete("/venue/:slug", verifyJWT(["admin"]), venueController.deleteVenue);
};
