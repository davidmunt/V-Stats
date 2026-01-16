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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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
    status: {
      type: String,
      default: "active",
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Team",
  }
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
    team_id: this._id,
    name: this.name,
    category: this.category,
    coach_id: this.coach_id,
    analyst_id: this.analyst_id,
    league_id: this.league_id,
    status: this.status,
    image: this.image,
    isActive: this.isActive,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Team", TeamSchema, "Team");
