const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const LeagueSchema = mongoose.Schema(
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
    country: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeagueAdmin",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "finished"],
      default: "active",
    },
    image: {
      type: String,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "League",
  },
);

// Aplicar el validador de unicidad para el slug
LeagueSchema.plugin(uniqueValidator, { msg: "already taken" });

// Middleware para generar el slug antes de validar
LeagueSchema.pre("validate", async function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  next();
});

// Método para formatear la respuesta JSON
LeagueSchema.methods.toLeagueResponse = async function () {
  return {
    slug: this.slug,
    league_id: this._id,
    name: this.name,
    country: this.country,
    category: this.category,
    season: this.season,
    admin_id: this.admin_id,
    status: this.status,
    image: this.image,
    is_active: this.is_active,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("League", LeagueSchema, "League");
