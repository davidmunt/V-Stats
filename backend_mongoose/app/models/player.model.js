const mongoose = require("mongoose");
const slugify = require("slugify");

const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, unique: true },
    dorsal: { type: Number, required: true },
    role: { type: String, required: true },
    image: { type: String, default: "" },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    status: { type: String, default: "active" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

PlayerSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + this.dorsal + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }
  next();
});

PlayerSchema.methods.toPlayerResponse = function () {
  return {
    id_player: this._id,
    slug: this.slug,
    name: this.name,
    dorsal: this.dorsal,
    role: this.role,
    image: this.image,
    id_team: this.team_id,
    status: this.status,
    is_active: this.is_active,
  };
};

module.exports = mongoose.model("Player", PlayerSchema, "Player");
