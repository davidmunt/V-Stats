const jwt = require("jsonwebtoken");

const generateAccessToken = (user, role) => {
  return jwt.sign({ user: { id: user._id, email: user.email, role: role } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });
};

const generateRefreshToken = (user, role) => {
  return jwt.sign({ user: { id: user._id, email: user.email, role: role } }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
