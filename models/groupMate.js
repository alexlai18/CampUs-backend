const mongoose = require("mongoose");


const groupMateSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId, // This relates to id of User
    name: String,
    email: String,
    course: String, // Relates to course code
    initials: String,
    ratingGiven: Number,
  },
);

module.exports = mongoose.model("GroupMate", groupMateSchema);