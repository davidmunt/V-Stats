const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const ActionSchema = mongoose.Schema(
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
    set_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Set",
      required: true,
    },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    player_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    player_position: {
      type: Number,
      min: 1,
      max: 6,
      required: true,
    },
    action_type: {
      type: String,
      enum: ["serve", "reception", "set", "attack", "block", "dig", "error"],
      required: true,
    },
    result: {
      type: String,
      enum: ["success", "fail", "ace", "blocked", "error", "positive", "negative"],
      required: true,
    },
    point_for_team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    start_x: { type: Number, default: 0 },
    start_y: { type: Number, default: 0 },
    end_x: { type: Number, default: 0 },
    end_y: { type: Number, default: 0 },
    status: {
      type: String,
      default: "recorded",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Action",
  },
);

ActionSchema.plugin(uniqueValidator, { msg: "already taken" });

ActionSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    this.slug = `act-${this.action_type}-${randomHash}`;
  }
  next();
});

ActionSchema.methods.toActionResponse = function () {
  return {
    slug: this.slug,
    action_id: this._id,
    match_id: this.match_id,
    set_id: this.set_id,
    team_id: this.team_id,
    player_id: this.player_id,
    player_position: this.player_position,
    action_type: this.action_type,
    result: this.result,
    point_for_team_id: this.point_for_team_id,
    coordinates: {
      start: { x: this.start_x, y: this.start_y },
      end: { x: this.end_x, y: this.end_y },
    },
    status: this.status,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Action", ActionSchema, "Action");
