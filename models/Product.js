// Product.js
const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
}, { collection: "Products" });

module.exports = mongoose.model("Product", ProductsSchema);