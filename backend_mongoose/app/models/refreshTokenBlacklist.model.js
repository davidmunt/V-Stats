const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const RefreshTokenBlacklistSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true, // Indexado para búsquedas rápidas durante la validación del login
    },
    reason: {
      type: String,
      trim: true,
      default: "logout", // logout, password_change, security_breach
    },
    // Este campo es crucial para el auto-borrado
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // El registro se elimina cuando el token original habría expirado
    },
  },
  {
    timestamps: { createdAt: "blacklisted_at", updatedAt: false }, // Renombramos createdAt a blacklisted_at
    collection: "RefreshTokenBlacklist",
  }
);

RefreshTokenBlacklistSchema.plugin(uniqueValidator, { msg: "already blacklisted" });

/**
 * Al ser una tabla de seguridad interna, no requiere slug ni
 * métodos de respuesta pública.
 */

module.exports = mongoose.model("RefreshTokenBlacklist", RefreshTokenBlacklistSchema, "RefreshTokenBlacklist");
