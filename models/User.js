// User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
  refreshToken: { type: String, required: false }
}, { collection: "Users" });

module.exports = mongoose.model("User", UserSchema);