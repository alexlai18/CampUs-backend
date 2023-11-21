const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserDetail = require("../models/userDetail");

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { imgUrl } = req.body;
    const user = await User.findById(id);
    if (!user.details) {
      res.status(400).json({message: "Please ask admin to investigate this error"});
    }
    const detailsId = user.details[0];
    const img = await UserDetail.findByIdAndUpdate(detailsId, {
      profilePic: imgUrl
    })
    res.json(img);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})