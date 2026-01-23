const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const LeagueAdmin = require("../models/leagueAdmin.model");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");
const Player = require("../models/player.model");

const verifyJWT = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Token ")) {
      return res.status(401).json({ message: "No autorizado: Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { id, role, email } = decoded.user;

      // 1. Verificar si el rol del token está en la lista de permitidos
      // Si allowedRoles está vacío, cualquier usuario autenticado pasa
      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Prohibido: No tienes los permisos necesarios" });
      }

      // 2. Buscar al usuario en la colección correcta según su rol
      let loginUser = null;
      const modelMap = {
        user: User,
        admin: LeagueAdmin,
        coach: Coach,
        analyst: Analyst,
        player: Player,
      };

      const TargetModel = modelMap[role];
      if (!TargetModel) {
        return res.status(403).json({ message: "Rol de token no reconocido" });
      }

      loginUser = await TargetModel.findById(id).exec();

      if (!loginUser || !loginUser.is_active) {
        return res.status(403).json({ message: "Usuario no encontrado o inactivo" });
      }

      // 3. Inyectar datos en la request para los controladores
      req.userId = loginUser._id;
      req.userEmail = loginUser.email;
      req.userRole = role;
      req.token = token;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado" });
      }
      return res.status(403).json({ message: "Token inválido", error: error.message });
    }
  };
};

module.exports = verifyJWT;
