const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const SubscriptionSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Asumiendo que tu modelo de usuarios se llama User
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    end_date: {
      type: Date,
      required: true,
    },
    auto_renew: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Gestiona created_at
    collection: "Subscription",
  }
);

SubscriptionSchema.plugin(uniqueValidator, { msg: "already taken" });

// Generación de slug: "sub-userId-random"
SubscriptionSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    this.slug = `sub-${randomHash}`;
  }
  next();
});

SubscriptionSchema.methods.toSubscriptionResponse = function () {
  // Verificación rápida si ha expirado
  const isExpired = new Date() > this.end_date;

  return {
    slug: this.slug,
    subscription_id: this._id,
    user_id: this.user_id,
    start_date: this.start_date,
    end_date: this.end_date,
    auto_renew: this.auto_renew,
    active: this.active && !isExpired, // Es activa si el flag está en true Y no ha pasado la fecha
    status: isExpired ? "expired" : this.status,
    isActive: this.isActive,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Subscription", SubscriptionSchema, "Subscription");
