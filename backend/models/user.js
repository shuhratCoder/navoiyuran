// backend/models/user.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    role: { type: String, default: "user" },
    fullName: { type: String },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      unique: false,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
