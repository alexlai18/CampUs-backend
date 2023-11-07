const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  const { email, password } = req.query;

  const users = await User.findOne({$and: [{email: email}, {password: password}]});

  if (!users) {
    return res.status(404).json({message: "Either the email or password is incorrect"});
  }
  return res.json(users);
})

module.exports = router;