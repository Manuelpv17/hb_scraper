const { Schema, model, Types } = require("mongoose");

const projectSchema = new Schema({
  name: String,
  id: String,
  duration: Number,
  reviews: [{ type: Types.ObjectId }],
});

module.exports = model("Project", projectSchema);
