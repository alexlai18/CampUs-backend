const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");
const UserDetail = require("../models/userDetail");

router.patch("/", async (req, res) => {
  const { id, courseCode, isJoining } = await req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  const detailId = user.details[0];
  const userDetails = await UserDetail.findById(detailId);
  const currentCourses = userDetails.currentCourses;

  const course = await Course.findOne({code: courseCode});
  const courseId = course._id;

  if (!courseId) {
    return res.status(404).json({ message: "Course doesn't exist" });
  }

  if (!currentCourses) {
    if (!isJoining) {
      return res.status(400).json({message: "Course not joined previously"});
    } else {
      const newCurrentCourses = await UserDetail.findByIdAndUpdate(detailId,
        {
          currentCourses: [courseId],
        }
      )
      return res.json({ message: `User Joined Course: ${newCurrentCourses}`});
    }
  } else {
    if (isJoining) {
      const newCourses = currentCourses;
      if (newCourses.includes(courseId)) {
        return res.status(400).json({message: "You're already in the course"});
      }
      newCourses.push(courseId);
      const updatedCourses = await UserDetail.findByIdAndUpdate(detailId,
        {
          currentCourses: newCourses
        }
      );
      return res.json({message: `User Joined Course: ${updatedCourses}`});
    } else {
      const newCourses = currentCourses;
      if (!newCourses.includes(courseId)) {
        return res.status(400).json({message: "Course not joined previously"});
      } else {
        newCourses.remove(courseId);
        const updatedCourses = await UserDetail.findByIdAndUpdate(detailId,
          {
            currentCourses: newCourses
          }
        );
        return res.json({message: `User Left Course: ${updatedCourses}`})
      }
    }
  }

})

module.exports = router;