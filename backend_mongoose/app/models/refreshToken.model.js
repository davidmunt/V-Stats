const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const RefreshTokenSchema = mongoose.Schema(
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
    },
    expires_at: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Índice TTL: Borra el documento automáticamente al llegar a esta fecha
    },
  },
  {
    timestamps: true, // Esto crea createdAt (tu campo created_at) y updatedAt
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
