// User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, required: true }
}, { collection: "Users" });

module.exports = mongoose.model("User", UserSchema);
