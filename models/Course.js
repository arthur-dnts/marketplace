// Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  cover: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { collection: "Courses" });

module.exports = mongoose.model("Course", CourseSchema);