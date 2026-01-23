const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const TeamSchema = mongoose.Schema(
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
    coach_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      default: null,
    },
    analyst_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analyst",
      default: null,
    },
    league_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },
    id_venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true, // Lo ponemos obligatorio según tu petición
    },
    status: {
      type: String,
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
    collection: "Team",
  },
);

TeamSchema.plugin(uniqueValidator, { msg: "already taken" });

TeamSchema.pre("validate", async function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  next();
});

TeamSchema.methods.toTeamResponse = function () {
  return {
    slug: this.slug,
    id_team: this._id,
    id_venue: this.id_venue,
    name: this.name,
    category: this.category,
    id_coach: this.coach_id,
    id_analyst: this.analyst_id,
    id_league: this.league_id,
    status: this.status,
    image: this.image,
    is_active: this.is_active,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Team", TeamSchema, "Team");
