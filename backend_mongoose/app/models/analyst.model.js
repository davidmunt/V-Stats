const mongoose = require("mongoose");
const slugify = require("slugify");

const AnalystSchema = mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: function () {
        return `https://robohash.org/${this.email || this.name}?set=set1`;
      },
    },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: false, default: null },
    dark_mode: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    is_active: { type: Boolean, default: true },
    refresh_token: { type: mongoose.Schema.Types.ObjectId, ref: "RefreshToken", required: false, default: null },
  },
  { timestamps: true, collection: "Analyst" },
);

AnalystSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = "analyst-" + slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36);
  }
  next();
});

module.exports = mongoose.model("Analyst", AnalystSchema, "Analyst");
