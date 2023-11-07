const mongoose = require("mongoose");


const notifSchema = new mongoose.Schema(
  {
    receiver: String,
    sender: String,
    action: String,
    message: String,
  },
);

module.exports = mongoose.model("Notifications", notifSchema);