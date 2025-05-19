// Ebook.js
const mongoose = require("mongoose");

const EbookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true }
}, { collection: "Ebooks" });

module.exports = mongoose.model("Ebook", EbookSchema);