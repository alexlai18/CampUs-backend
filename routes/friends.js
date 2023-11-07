const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserDetail = require("../models/userDetail");

router.get("/", async (req, res) => {
  const { email, prefix } = req.query;

  const user = await User.findOne({email: email});

  if (!user) {
    res.status(404).json({message: "This user does not exist in the database"});
  }

  const friends = user.friends;

  if (!friends || friends.length === 0) {
    return res.json([]);
  }

  const resArr = [];
  async function getFriends() {
    await Promise.all(
      friends.map(async (friend) => {
        if ((friend.toLowerCase()).includes(prefix.toLowerCase())) {
          // Get user details
          const friendUser = await User.findOne({email: friend});
          const detailId = friendUser.details[0];
          const details = await UserDetail.findById(detailId).lean();
          if (details) {
            details.email = friend;
            resArr.push(details);
          }
        }
        }
      )
    );
  }
  await getFriends();
  return res.json(resArr);
})

router.patch("/", async (req, res) => {
  const { id, email } = await req.body;

  const sender = await User.findById(id);
  const receiver = await User.findOne({email: email});

  if (!receiver) {
    return res.status(400).json({message: "The user you're trying to add does not exist."})
  }

  if (sender.friends.includes(receiver.email)) {
    return res.status(400).json({message: "You're already friends with this user"});
  }

  const updatedList = sender.friends ? sender.friends : [];
  updatedList.push(receiver.email);

  await User.findByIdAndUpdate(id,
    {
      friends: updatedList
    }
  );

  const receiverList = receiver.friends ? receiver.friends : [];
  receiverList.push(sender.email);
  await User.findOneAndUpdate({email : email}, {
    friends: receiverList
  })

  return res.json({ message: "Friend Added"});
})

router.delete("/", async (req, res) => {
  const { id, email } = await req.body;

  const sender = await User.findById(id);
  const receiver = await User.findOne({email: email});

  if (!receiver) {
    return res.status(404).json({message: "The user you're trying to remove does not exist."});
  }

  if (!sender.friends.includes(email)) {
    return res.status(400).json({message: "You're not friends with this user"});
  }

  const updatedList = sender.friends.remove(receiver.email);

  await User.findByIdAndUpdate(id,
    {
      friends: updatedList
    }
  )

  const receiverList = receiver.friends.remove(sender.email);
  await User.findOneAndUpdate({email: email},
    {
      friends: receiverList
    }
  )
  return res.json({message: "Friend Removed"});
})

module.exports = router;