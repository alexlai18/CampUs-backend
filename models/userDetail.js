const mongoose = require("mongoose");


const userDetailSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    fullName: String,
    grade: Number,
    about: String,
    uni: String,
    currentGroups: [{type: mongoose.Schema.ObjectId, ref: 'Group'}],
    pastGroups: [{type: mongoose.Schema.ObjectId, ref: 'Group'}],
    currentCourses: [{type: mongoose.Schema.ObjectId, ref: 'Course'}],
    pastCourses: [{type: mongoose.Schema.ObjectId, ref: 'Course'}]
  },
);

module.exports = mongoose.model("UserDetail", userDetailSchema);