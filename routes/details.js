const express = require("express");
const router = express.Router();
const UserDetail = require("../models/userDetail");

router.get("/", async (req, res) => {
  const { id } = req.query;
  const info = await UserDetail.findById(id);
  if (!info) {
    return res.status(404).json({message: "There is no UserDetail document corresponding to id"});
  }
  return res.json(info);
})

module.exports = router;