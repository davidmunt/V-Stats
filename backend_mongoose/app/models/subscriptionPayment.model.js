const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const SubscriptionPaymentSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number, // En MongoDB/JS usamos Number para decimales
      required: true,
    },
    currency: {
      type: String,
      default: "EUR",
      uppercase: true,
    },
    payment_method: {
      type: String, // ej: "card", "paypal", "apple_pay"
      required: true,
    },
    stripe_payment_id: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["succeeded", "pending", "failed", "refunded"],
      default: "pending",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Gestiona created_at automáticamente
    collection: "SubscriptionPayment",
  },
);

SubscriptionPaymentSchema.plugin(uniqueValidator, { msg: "already exists" });

// Generación de slug: "pay-stripeID-random"
SubscriptionPaymentSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
    this.slug = `pay-${randomHash}`;
  }
  next();
});

SubscriptionPaymentSchema.methods.toPaymentResponse = function () {
  return {
    slug: this.slug,
    payment_id: this._id,
    user_id: this.user_id,
    amount: this.amount,
    currency: this.currency,
    payment_method: this.payment_method,
    stripe_payment_id: this.stripe_payment_id,
    status: this.status,
    createdAt: this.createdAt,
    is_active: this.is_active,
  };
};

module.exports = mongoose.model("SubscriptionPayment", SubscriptionPaymentSchema, "SubscriptionPayment");
