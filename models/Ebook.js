// Ebook.js

const mongoose = require("mongoose");

const Ebook = mongoose.model("Ebook", {
    title: String,
    category: String,
    price: String
})

module.exports = Ebook
