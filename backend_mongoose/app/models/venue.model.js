const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const VenueSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
    indoor: {
      type: Boolean,
      default: true, // Por defecto, la mayoría de pabellones de voleibol son cubiertos
    },
    status: {
      type: String,
      default: "available", // available, maintenance, closed
    },
    id_admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Esto crea automáticamente createdAt y updatedAt
    collection: "Venue",
  },
);

// Aplicar el validador de unicidad para el slug
VenueSchema.plugin(uniqueValidator, { msg: "already taken" });

// Middleware para generar el slug antes de validar
VenueSchema.pre("validate", async function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  next();
});

VenueSchema.methods.toVenueResponse = function () {
  return {
    id_venue: this._id, // Transformamos _id en id_venue para el frontend
    name: this.name,
    address: this.address,
    city: this.city,
    capacity: this.capacity,
    indoor: this.indoor,
    status: this.status,
    slug: this.slug,
    is_active: this.is_active,
    id_admin: this.id_admin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Venue", VenueSchema, "Venue");
