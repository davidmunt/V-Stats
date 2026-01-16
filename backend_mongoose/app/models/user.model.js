const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    premium: { type: Boolean, default: false },
    dark_mode: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "User" }
);

UserSchema.plugin(uniqueValidator, { msg: "already taken" });

UserSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  next();
});

UserSchema.methods.toUserResponse = function () {
  return {
    slug: this.slug,
    user_id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    premium: this.premium,
    dark_mode: this.dark_mode,
  };
};

module.exports = mongoose.model("User", UserSchema, "User");
