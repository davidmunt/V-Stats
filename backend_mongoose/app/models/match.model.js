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
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Match",
  },
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
    id_match: this._id,
    slug: this.slug,
    // Generamos un nombre descriptivo para el frontend: "Barca vs Valencia"
    name: this.local_team_id?.name && this.visitor_team_id?.name ? `${this.local_team_id.name} vs ${this.visitor_team_id.name}` : "Partido",
    // Podemos usar la imagen del equipo local como imagen del partido por defecto
    image: this.local_team_id?.image || "",
    id_league: this.league_id?._id || this.league_id,
    id_team_local: this.local_team_id?._id || this.local_team_id,
    id_team_visitor: this.visitor_team_id?._id || this.visitor_team_id,
    id_venue: this.venue_id?._id || this.venue_id,
    date: this.date,
    status: this.status,
    current_set: this.current_set,
    is_active: this.is_active,
  };
};

module.exports = mongoose.model("Match", MatchSchema, "Match");
