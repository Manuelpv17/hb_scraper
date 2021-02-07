const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  score: Number,
  project_id: String,
  student_id: String,
});

module.exports = model("Review", reviewSchema);
