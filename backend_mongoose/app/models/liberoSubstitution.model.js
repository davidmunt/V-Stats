const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const LiberoSubstitutionSchema = mongoose.Schema(
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
    libero_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    replaced_player_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    position: {
      type: Number,
      min: 1,
      max: 6,
      required: true,
    },
    status: {
      type: String,
      default: "completed",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Esto cubre tu campo created_at
    collection: "LiberoSubstitution",
  },
);

LiberoSubstitutionSchema.plugin(uniqueValidator, { msg: "already taken" });

// Generación de slug: "sub-libero-random"
LiberoSubstitutionSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const randomHash = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    this.slug = `sub-lib-${randomHash}`;
  }
  next();
});

LiberoSubstitutionSchema.methods.toLiberoSubstitutionResponse = function () {
  return {
    slug: this.slug,
    substitution_id: this._id,
    match_id: this.match_id,
    team_id: this.team_id,
    libero_id: this.libero_id,
    replaced_player_id: this.replaced_player_id,
    position: this.position,
    status: this.status,
    createdAt: this.createdAt,
    is_active: this.is_active,
  };
};

module.exports = mongoose.model("LiberoSubstitution", LiberoSubstitutionSchema, "LiberoSubstitution");
