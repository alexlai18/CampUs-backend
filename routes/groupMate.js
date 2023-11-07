const express = require("express");
const router = express.Router();
const User = require("../models/user");
const GroupMate = require("../models/groupMate");

router.post("/", async (req, res) => {
  const { user, name, email, course, initials, ratingGiven } = await req.body;

  if (!User.findById(user)) {
    return res.status(404).json({message: "This user does not exist"});
  }

  await GroupMate.create(
    {
      user,
      name,
      email,
      course,
      initials,
      ratingGiven
    }
  );

  return res.json({message: "Groupmate Added"});
})

router.get("/", async (req, res) => {
  const gmate = await GroupMate.find();

  if (!gmate || gmate.length === 0) {
    return res.status(404).json({message: "There are no group mates in the database"});
  }

  return res.json(courses);
})

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const gmate = await GroupMate.findOne({_id: id});

  if (!gmate) {
    return res.status(404).json({message: "This groupmate does not exist in the database"});
  }

  return res.json({ gmate });
})

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { user, name, email, course, initials, ratingGiven } = await req.body;

  const gmate = await GroupMate.findOne({_id: id});

  if (!gmate) {
    return res.status(404).json({message: "This groupmate does not exist in the database"});
  } else {
    await GroupMate.findByIdAndUpdate(detailId,
      {
        user: user || gmate.user,
        name: name || gmate.name,
        email: email || gmate.email,
        course: course || gmate.course,
        initials: initials || gmate.initials,
        ratingGiven: ratingGiven || gmate.ratingGiven,
     }
    )
  }

  return res.json({ message: "GroupMate updated" });
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await GroupMate.findByIdAndDelete(id);
  return res.json({message: "GroupMate Deleted"});
})