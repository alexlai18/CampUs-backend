const express = require("express");
const router = express.Router();
const Group = require("../models/group");
const Message = require("../models/message");

router.get("/", async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findOne({_id: groupId}).lean();
  if (!group) {
    return res.status(404).json({message: "This group does not exist"});
  }

  const messages = group.messages;
  const resArr = [];

  await Promise.all(
    messages.map(async (m) => {
      resArr.push(await Message.findById(m));
    })
  )
  resArr.sort((a, b) => a.timestamps.createdAt - b.timestamps.createdAt);
  return res.json(resArr);
})

router.post("/", async (req, res) => {
  const { sender, content, timestamps, groupId } = await req.body;

  const group = await Group.findOne({_id: groupId}).lean();
  const message = await Message.create({
    sender: sender,
    content: content,
    timestamps: timestamps
  });
  const groupMsg = group.messages || [];
  groupMsg.push(message._id);
  await Group.findByIdAndUpdate(groupId,
    {
      messages: groupMsg
    },
  );
  return res.json(message);
})

router.patch("/", async (req, res) => {
  const { messageId, groupId } = await req.body;
  const group = await Group.findById(groupId);
  const groupMsg = group.messages;
  groupMsg.remove(messageId);

  await Group.findByIdAndUpdate(groupId,
    {
      messages: groupMsg
    }
  );
  await Message.findByIdAndDelete(messageId);
  return res.json("Message has been removed");
})

module.exports = router;