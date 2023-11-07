const express = require("express");
const router = express.Router();
const Notifications = require("../models/notifications");
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { receiver, sender, action, message } = await req.body;
  const sentNotif = await Notifications.create(
    {
      receiver: receiver,
      sender: sender,
      action: action,
      message: message,
    }
  );

  if (!sentNotif) {
    return res.status(400).json({ message: "Could not create a notification" });
  }

  return res.json({ message: `Notification sent: ${sentNotif}`});
});

router.get("/", async (req, res) => {
  const { receiver } = req.query;

  if (!receiver) {
    const notifs = await Notifications.find();
    return res.json(notifs);
  } else {
    const user = await User.find({email: receiver});
    if (!user) {
      return res.status(404).json({message: "This user does not exist"});
    }
    const notifs = await Notifications.find({receiver: receiver});
    return res.json(notifs);
  }
});

router.delete("/", async (req, res) => {
  const { receiver, notifId } = await req.body;
  if (receiver) {
    const deleted = await Notifications.deleteMany({receiver: receiver});
    return res.json({message: `Deleted ${deleted} number of notifications`})
  }

  if (notifId) {
    const deleted = await Notifications.findOneAndDelete({_id: notifId});
    return res.json({message: `Deleted notification ${deleted}`});
  }
})

module.exports = router;