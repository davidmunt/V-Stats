const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const RefreshTokenSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel", // Referencia dinámica
    },
    onModel: {
      type: String,
      required: true,
      enum: ["User", "LeagueAdmin", "Coach", "Analyst", "Player"], // Nombres de los modelos
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires_at: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    collection: "RefreshToken",
  }
);

RefreshTokenSchema.plugin(uniqueValidator, { msg: "already exists" });

/**
 * Nota: No añadimos slug a esta tabla porque los Refresh Tokens
 * son datos sensibles que nunca se exponen en una URL.
 * Se manejan internamente o vía Cookies.
 */

RefreshTokenSchema.methods.toTokenResponse = function () {
  return {
    user_id: this.user_id,
    token: this.token,
    expires_at: this.expires_at,
    created_at: this.createdAt,
  };
};

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema, "RefreshToken");
