const express = require("express");
const router = express.Router();
const Course = require("../models/course");

router.post("/", async (req, res) => {
  try {
    const { code, perGroup } = await req.body;

    const found = await Course.findOne({code: code});
    if (found) {
      return res.status(400).json({ message: "This course has already been registered"});
    }

    const course = await Course.create({
      code: code,
      perGroup: perGroup,
    });

    res.json(course);
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.get("/", async (req, res) => {
  try {
    const { prefix } = req.query;

    const courses = await Course.find();
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({message: "There are no courses in the database"}, { status: 404 });
    }
  
    const courseList = [];
    courses.map((course) => {
      if ((course.code.toLowerCase()).includes(prefix.toLowerCase())) {
        courseList.push(course);
      }
    });
  
    const sortedCourses = courseList.sort((a, b) => {
      const idxA = a.code.toLowerCase().indexOf(prefix.toLowerCase());
      const idxB = b.code.toLowerCase().indexOf(prefix.toLowerCase());
  
      if (idxA === idxB) {
        return a.code.toLowerCase().split(prefix.toLowerCase()).length - 1 > b.code.toLowerCase().split(prefix.toLowerCase()).length - 1
      }
      return idxA - idxB;
    });
  
    return res.json(sortedCourses);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
})

router.patch("/", async (req, res) => {
  try {
    const { code, perGroup } = await req.body;
    const course = await Course.findOne({code: code});

    if (!course) {
      return res.status(404).json({ message: "Course doesn't exist" });
    }

    if (course.perGroup === perGroup) {
      return res.status(400).json({ message: "You're not making any changes" });
    }

    const updatedCourse = await Course.findOneAndUpdate({code: code},
      {
        perGroup: perGroup
      }
    );
    
    return res.json(updatedCourse);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
})

router.delete("/", async (req, res) => {
  try {
    const { code } = await req.body;
    const deletion = await Course.findOneAndDelete({code: code});
    if (deletion) {
      return res.json({ message: `Deleted Course: ${deletion}`});
    } else {
      return res.status(404).json({message: "Course doesn't exist"});
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
})

module.exports = router;