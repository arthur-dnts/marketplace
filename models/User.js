// User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  gender: { type: String, required: false },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  adress: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
  refreshToken: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
}, { collection: "Users" });

module.exports = mongoose.model("User", UserSchema);