const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const Course = require("../models/course");
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { name, courseCode, members, target } = await req.body;

  const course = await Course.findOne({code: courseCode});

  if (course === undefined) {
    return res.status(400).json({message: "This course does not exist"});
  }

  const memberList = [];
  
  async function getMembers() {
    await Promise.all (
      members.map(async (m) => {
        const user = await User.findOne({email: m});
        memberList.push(user._id);
      })
    );
  };
  await getMembers();
  const group = await Group.create(
    {
      name,
      courseCode,
      members: memberList,
      target,
      messages: []
    }
  );
  return res.json(group);
})

router.get("/", async (req, res) => {
  const { course, prefix, id } = req.query;

  if (course) {
    const groups = await Group.find({courseCode: course});
    const resArr = [];
    groups.map((g) => {
      if ((g.name.toLowerCase()).includes(prefix.toLowerCase())) {
        resArr.push(g);
      }
    });
    return res.json(resArr);
  } else if (id) {
    const resArr = await Group.findById(id);
    return res.json(resArr);
  } else if (prefix !== null) {
    const groups = await Group.find();
    const resArr = [];
    groups.map((g) => {
      if ((g.name.toLowerCase()).includes(prefix.toLowerCase())) {
        resArr.push(g);
      }
    });
    const sortedCourses = resArr.sort((a, b) => {
      const idxA = a.name.toLowerCase().indexOf(prefix.toLowerCase());
      const idxB = b.name.toLowerCase().indexOf(prefix.toLowerCase());
  
      if (idxA === idxB) {
        return a.name.toLowerCase().split(prefix.toLowerCase()).length - 1 > b.name.toLowerCase().split(prefix.toLowerCase()).length - 1
      }
      return idxA - idxB;
    });
    return res.json(sortedCourses);
  }
  return res.status(400).json({message: "Invalid Request"});
})

router.patch("/", async (req, res) => {
  const { id } = req.query;
  const { courseCode, members, target } = await req.body;

  const group = Group.findById(id);
  const resArr = Group.findByIdAndUpdate(
    {
      courseCode: courseCode || group.courseCode,
      members: members || group.members,
      target: target || group.target,
    }
  );

  return res.json(resArr);
})

router.delete("/", async (req, res) => {
  const { id } = await req.body;
  const group = Group.findByIdAndDelete(id);
  return res.json({message: `This group has been deleted: ${group}`});
})

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = await req.body;

  if (!userId || !id) {
    return res.status(400).json({message: "Provide a group or userId"});
  }

  const group = await Group.findById(id);
  const members = group.members;
  if (!members.includes(userId)) {
    members.push(userId);
    await Group.findByIdAndUpdate(id, {
      members: members
    })
    return res.json({message: "This user has been added to the group"});
  } else {
    return res.status(400).json({message: "This user is already in the group"});
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = await req.body;

  if (!userId || !id) {
    return res.status(400).json({message: "Provide a group or userId"});
  }

  const group = await Group.findById(id);
  const members = group.members;
  if (members.includes(userId)) {
    members.remove(userId);
    await Group.findByIdAndUpdate(id, {
      members: members
    })
    return res.json({message: "This group has been deleted"});
  } else {
    return res.status(400).json({message: "This user is not a part of the group"});
  }
})

module.exports = router;