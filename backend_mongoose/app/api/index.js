const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: ["http://localhost:5173", "http://frontend:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const dbConfig = require("../config/database.config.js");

mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, { useNewUrlParser: true })
  .then(() => {
    console.log("✅ Conectado a la base de datos");
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
    process.exit();
  });

require("../routes/auth.router.js")(app);
require("../routes/league.router.js")(app);
require("../routes/team.router.js")(app);
require("../routes/categoryLeague.router.js")(app);
require("../routes/venue.router.js")(app);
require("../routes/match.router.js")(app);
require("../routes/coach.router.js")(app);
require("../routes/analyst.router.js")(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor Express escuchando en el puerto ${PORT}`);
});
