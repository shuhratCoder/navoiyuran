// backend/models/role.js
const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    attachFile: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Role || mongoose.model("Role", RoleSchema);
