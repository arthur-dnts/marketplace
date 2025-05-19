// Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true }
}, { collection: "Course" });

module.exports = mongoose.model("Course", CourseSchema);