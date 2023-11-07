const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
  {
    sender: {type: mongoose.Schema.ObjectId, ref: 'User'},
    content: String,
    timestamps: {
      createdAt: Date,
      updatedAt: Date
    }
  },
);

module.exports = mongoose.model("Message", messageSchema);