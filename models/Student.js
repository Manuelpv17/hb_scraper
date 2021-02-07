const { Schema, model, Types } = require("mongoose");

const studentSchema = new Schema({
  id: Number,
  name: String,
  city: String,
  cohort: String,
  github: String,
  status: String,
  reviews: [{ type: Types.ObjectId }],
});

module.exports = model("Student", studentSchema);
