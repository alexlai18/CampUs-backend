const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema(
  {
    code: String,
    perGroup: Number,
  },
);

module.exports = mongoose.model("Course", courseSchema);