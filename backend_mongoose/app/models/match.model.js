const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const MatchSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    league_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
    },
    local_team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    visitor_team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    venue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    created_by_admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeagueAdmin",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "finished", "cancelled"],
      default: "scheduled",
    },
    current_set: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Match",
  }
);

MatchSchema.plugin(uniqueValidator, { msg: "already taken" });

MatchSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    this.slug = `match-${randomHash}`;
  }
  next();
});

MatchSchema.methods.toMatchResponse = function () {
  return {
    slug: this.slug,
    match_id: this._id,
    league_id: this.league_id,
    local_team_id: this.local_team_id,
    visitor_team_id: this.visitor_team_id,
    venue_id: this.venue_id,
    created_by_admin_id: this.created_by_admin_id,
    date: this.date,
    status: this.status,
    current_set: this.current_set,
    isActive: this.isActive,
  };
};

module.exports = mongoose.model("Match", MatchSchema, "Match");
