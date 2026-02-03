const asyncHandler = require("express-async-handler");
const argon2 = require("argon2");
const { generateAccessToken, generateRefreshToken } = require("../middleware/authService");
const User = require("../models/user.model");
const LeagueAdmin = require("../models/leagueAdmin.model");
const Coach = require("../models/coach.model");
const Analyst = require("../models/analyst.model");
const Player = require("../models/player.model");
const RefreshToken = require("../models/refreshToken.model");
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/refreshTokenBlacklist.model");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, user_type, avatar, dorsal, role } = req.body;
  if (!email || !password || !name || !user_type) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }
  const allModels = [
    { model: User, type: "user", modelName: "User" },
    { model: LeagueAdmin, type: "admin", modelName: "LeagueAdmin" },
    { model: Coach, type: "coach", modelName: "Coach" },
    { model: Analyst, type: "analyst", modelName: "Analyst" },
    { model: Player, type: "player", modelName: "Player" },
  ];
  for (const item of allModels) {
    const existing = await item.model.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email ya en uso" });
  }
  const hashedPwd = await argon2.hash(password);
  let newUser;
  let modelName;
  const userData = { name, email, password: hashedPwd, avatar: avatar || "" };
  switch (user_type) {
    case "admin":
      newUser = await LeagueAdmin.create(userData);
      modelName = "LeagueAdmin";
      break;
    case "coach":
      newUser = await Coach.create(userData);
      modelName = "Coach";
      break;
    case "analyst":
      newUser = await Analyst.create(userData);
      modelName = "Analyst";
      break;
    case "player":
      newUser = await Player.create({ ...userData, dorsal: dorsal || 0, role: role || "outside" });
      modelName = "Player";
      break;
    default:
      newUser = await User.create(userData);
      modelName = "User";
      break;
  }
  const accessToken = generateAccessToken(newUser, user_type);
  const refreshTokenValue = generateRefreshToken(newUser, user_type);
  const tokenDoc = await RefreshToken.create({
    user_id: newUser._id,
    onModel: modelName,
    token: refreshTokenValue,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  newUser.refresh_token = tokenDoc._id;
  await newUser.save();
  res.status(201).json({
    token: accessToken,
    user_type: user_type,
    email: newUser.email,
    name: newUser.name,
    id: newUser._id,
    avatar: newUser.avatar,
    slug: newUser.slug,
    id_team: null,
    // añade aquí cualquier otro campo que necesites (ej. avatar, etc)
  });
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña requeridos" });
  }

  let foundUser = null;
  let userType = null;
  let modelName = null;

  const modelsToSearch = [
    { model: User, type: "user", name: "User" },
    { model: LeagueAdmin, type: "admin", name: "LeagueAdmin" },
    { model: Coach, type: "coach", name: "Coach" },
    { model: Analyst, type: "analyst", name: "Analyst" },
    { model: Player, type: "player", name: "Player" },
  ];

  for (const item of modelsToSearch) {
    foundUser = await item.model.findOne({ email }).exec();
    if (foundUser) {
      userType = item.type;
      modelName = item.name;
      break;
    }
  }

  if (!foundUser) return res.status(404).json({ message: "Usuario no encontrado" });

  const match = await argon2.verify(foundUser.password, password);
  if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

  const accessToken = generateAccessToken(foundUser, userType);
  const refreshTokenValue = generateRefreshToken(foundUser, userType);

  const tokenDoc = await RefreshToken.findOneAndUpdate(
    { user_id: foundUser._id },
    {
      token: refreshTokenValue,
      onModel: modelName,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    { upsert: true, new: true },
  );

  foundUser.refresh_token = tokenDoc._id;
  await foundUser.save();

  res.status(200).json({
    token: accessToken,
    user_type: userType,
    email: foundUser.email,
    name: foundUser.name,
    id: foundUser._id,
    avatar: foundUser.avatar || "",
    slug: foundUser.slug,
    // Verificamos si tiene team_id (Analistas, Coaches, Players)
    id_team: foundUser.team_id || null,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Token ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const expiredToken = authHeader.split(" ")[1];

  try {
    // 1. Decodificamos el token incluso si expiró para saber quién es el usuario
    const decoded = jwt.verify(expiredToken, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true });
    // 2. Buscamos el RefreshToken en la DB asociado a ese usuario
    const storedToken = await RefreshToken.findOne({ user_id: decoded.user.id }).exec();
    if (!storedToken) {
      return res.status(403).json({ message: "No hay sesión activa para este usuario" });
    }
    // 3. Verificamos si el RefreshToken de la DB ha expirado (usando la fecha que guardamos)
    if (storedToken.expires_at < new Date()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      return res.status(403).json({ message: "Sesión expirada. Por favor, inicia sesión de nuevo" });
    }
    // 4. Si todo está bien, generamos un nuevo AccessToken
    // El payload lo sacamos del decoded original o del usuario en DB
    const newAccessToken = generateAccessToken(
      {
        _id: decoded.user.id,
        email: decoded.user.email,
      },
      decoded.user.role,
    );
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Error al refrescar token", error: error.message });
  }
});

const logout = asyncHandler(async (req, res) => {
  const token = req.token; // Pillado del middleware verifyJWT
  // 1. Eliminar el RefreshToken de la DB para que no pueda pedir nuevos AccessTokens
  await RefreshToken.deleteOne({ user_id: req.userId });
  // 2. Opcional: Meter el AccessToken actual en la Blacklist hasta que expire
  // Para que nadie pueda usar ese token aunque se lo roben justo antes del logout
  const decoded = jwt.decode(token);
  await Blacklist.create({
    token: token,
    expiresAt: new Date(decoded.exp * 1000),
  });
  res.status(200).json({ message: "Sesión cerrada y tokens invalidados" });
});

const getMe = asyncHandler(async (req, res) => {
  const { userId, userRole } = req;
  let model;

  switch (userRole) {
    case "admin":
      model = LeagueAdmin;
      break;
    case "coach":
      model = Coach;
      break;
    case "analyst":
      model = Analyst;
      break;
    case "player":
      model = Player;
      break;
    default:
      model = User;
      break;
  }

  const foundUser = await model.findById(userId).exec();

  if (!foundUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.status(200).json({
    token: req.token,
    user_type: userRole,
    email: foundUser.email,
    slug: foundUser.slug,
    name: foundUser.name,
    id: foundUser._id,
    // Mapeo consistente: team_id del modelo -> id_team del JSON
    id_team: foundUser.team_id || null,
    avatar: foundUser.avatar || "",
    ...(userRole === "player" && {
      dorsal: foundUser.dorsal,
      role: foundUser.role,
    }),
  });
});

module.exports = { registerUser, userLogin, refreshToken, logout, getMe };
