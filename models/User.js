// User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  telefone: String,
  password: String,
  refreshToken: String
}, { collection: "Users" });

module.exports = mongoose.model("User", UserSchema);
