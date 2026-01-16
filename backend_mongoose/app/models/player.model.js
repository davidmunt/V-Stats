const mongoose = require("mongoose");
const slugify = require("slugify");

const PlayerSchema = mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // sparse permite nulos aunque sea unique
    dorsal: { type: Number, required: true },
    role: {
      type: String,
      enum: ["setter", "middle", "outside", "opposite", "libero"],
      required: true,
    },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    status: { type: String, default: "active" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "Player" }
);

PlayerSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + this.dorsal + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }
  next();
});

PlayerSchema.methods.toPlayerResponse = function () {
  return {
    slug: this.slug,
    player_id: this._id,
    name: this.name,
    dorsal: this.dorsal,
    role: this.role,
    team_id: this.team_id,
  };
};

module.exports = mongoose.model("Player", PlayerSchema, "Player");
