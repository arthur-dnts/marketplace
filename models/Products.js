// Products.js

const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: String
}, { collection: "Products" });

module.exports = mongoose.model("Products", ProductsSchema);
