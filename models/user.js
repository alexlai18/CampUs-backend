const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    details: [{type: mongoose.Schema.ObjectId, ref: 'UserDetail'}],
    friends: [{type: String}]
  },
);

module.exports = mongoose.model("User", userSchema);