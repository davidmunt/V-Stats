const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const LineupPositionSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    lineup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lineup",
      required: true,
    },
    player_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    is_on_court: {
      type: Boolean,
      default: true,
    },
    initial_position: {
      type: Number,
      min: 1,
      max: 7,
      required: true,
    },
    current_position: {
      type: Number,
      min: 1,
      max: 7,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "LineupPosition",
  },
);

LineupPositionSchema.plugin(uniqueValidator, { msg: "already taken" });

LineupPositionSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 5)) | 0).toString(36);
    this.slug = `pos-${randomHash}`;
  }
  next();
});

LineupPositionSchema.methods.toLineupPositionResponse = function () {
  return {
    slug: this.slug,
    lineup_position_id: this._id,
    lineup_id: this.lineup_id,
    player_id: this.player_id,
    is_on_court: this.is_on_court,
    initial_position: this.initial_position,
    current_position: this.current_position,
    status: this.status,
    is_active: this.is_active,
  };
};

module.exports = mongoose.model("LineupPosition", LineupPositionSchema, "LineupPosition");
