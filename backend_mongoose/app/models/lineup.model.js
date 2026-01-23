const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const LineupSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    match_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    status: {
      type: String,
      enum: ["starting", "final", "modified"],
      default: "starting",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Lineup",
  },
);

LineupSchema.plugin(uniqueValidator, { msg: "already taken" });

LineupSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    this.slug = `lineup-${randomHash}`;
  }
  next();
});

LineupSchema.methods.toLineupResponse = function () {
  return {
    slug: this.slug,
    lineup_id: this._id,
    match_id: this.match_id,
    team_id: this.team_id,
    status: this.status,
    is_active: this.is_active,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Lineup", LineupSchema, "Lineup");
