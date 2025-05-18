// Ebook.js

const mongoose = require("mongoose");

const EbookSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: String
}, { collection: "Ebooks" });

module.exports = mongoose.model("Ebooks", EbookSchema);
