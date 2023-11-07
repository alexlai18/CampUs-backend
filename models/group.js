const mongoose = require("mongoose");


const groupSchema = new mongoose.Schema(
  {
    name: String,
    courseCode: String,
    members: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    target: {
      type: String,
      validate: {
        validator: function(v) {
          return ["PS", "CR", "D", "HD"].includes(v);
        },
        message: props => `${props.value} is not a valid grade`
      },
    },
    messages:[{type: mongoose.Schema.ObjectId, ref: 'Message'}]
  },
);

module.exports = mongoose.model("Group", groupSchema);