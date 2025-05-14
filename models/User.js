const mongoose = require("mongoose");

const User = mongoose.model("User", {
    name: String,
    surname: String,
    email: String,
    telefone: String,
    password: String,
    refreshToken: String
});

module.exports = User;
