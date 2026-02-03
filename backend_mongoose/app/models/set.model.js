const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const SetSchema = mongoose.Schema(
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
    set_number: {
      type: Number,
      required: true,
    },
    local_points: {
      type: Number,
      default: 0,
    },
    visitor_points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "in_progress",
    },
    finished_at: {
      type: Date,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Set",
  },
);

SetSchema.plugin(uniqueValidator, { msg: "already taken" });

SetSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
    this.slug = `set-${this.set_number}-m-${randomHash}`;
  }
  next();
});

SetSchema.methods.toSetResponse = function () {
  return {
    slug: this.slug,
    set_id: this._id,
    match_id: this.match_id,
    set_number: this.set_number,
    local_points: this.local_points,
    visitor_points: this.visitor_points,
    status: this.status,
    finished_at: this.finished_at,
    is_active: this.is_active,
  };
};

module.exports = mongoose.model("Set", SetSchema, "Set");
