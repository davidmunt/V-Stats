const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const LeagueAdminSchema = mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    dark_mode: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    isActive: { type: Boolean, default: true },
    refresh_token: { type: mongoose.Schema.Types.ObjectId, ref: "RefreshToken", required: false, default: null },
  },
  { timestamps: true, collection: "LeagueAdmin" }
);

LeagueAdminSchema.plugin(uniqueValidator, { msg: "already taken" });

LeagueAdminSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = "admin-" + slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }
  next();
});

module.exports = mongoose.model("LeagueAdmin", LeagueAdminSchema, "LeagueAdmin");
