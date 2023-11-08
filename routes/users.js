const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserDetail = require("../models/userDetail");

// Create a user
router.post("/", async (req, res) => {
  try {
    const { email, password } = await req.body;

    const found = await User.findOne({email: email});
    if (found) {
      return res.status(400).json({ message: "This email has already been registered"});
    }


    const user = await User.create({
      email: email,
      password: password,
      details: await UserDetail.create(),
      friends: []
    });

    res.json(user);
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Get all users or specific user given either email or search value
router.get("/", async (req, res) => {
  try {
    const { email, val, userId } = req.query;
    
    // If we get an email as query, we simply find the user with the corresponding email
    if (email) {
      const user = await User.findOne({email: email});
      if (!user || user.length === 0) {
        return res.status(404).json({message: "This user does not exist in the database"});
      }
    
      return res.json(user);
    } else if (val) {
      // If we get a search value from the query, we look for all users with the substring
      const users = await User.find();
      const results = [];
  
      // This gets all the users (except for user who searched) and pushes it onto an array of users
      async function getSearchUsers() {
        await Promise.all(
          users.map(async (u) => {
            // Get user details
            const detailId = u.details[0];
            const details = await UserDetail.findById(detailId).lean();
            if (!details) {
              return;
            }
  
            const fullName = details.fname + " " + details.lname;
            if (fullName.toLowerCase().includes(val.toLowerCase()) && userId !== u._id.toString()) {
              details.email = u.email;
              details.fullName = fullName;
              results.push(details);
            }
          })
        );
      }
      await getSearchUsers();
  
      // This sorts the array of users by the position of the substring, and then by the frequency
      const sortedNames = results.sort((a, b) => {
        const idxA = a.fullName.toLowerCase().indexOf(val.toLowerCase());
        const idxB = b.fullName.toLowerCase().indexOf(val.toLowerCase());
  
        if (idxA === idxB) {
          return a.fullName.toLowerCase().split(val.toLowerCase()).length - 1 > b.fullName.toLowerCase().split(val.toLowerCase()).length - 1
        }
        return idxA - idxB;
      });
  
      return res.json(sortedNames);
    } else {
      // Return all users
      const users = await User.find();

      if (!users || users.length === 0) {
        return res.status(404).json({message: "There are no users in the database"}, { status: 404 });
      }
    
      return res.json(users);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Get one user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "This user does not exist"});
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Update a user
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, details } = await req.body;
  
    const user = await User.findById(id);
  
    if (!user) {
      return res.status(404).json({ message: "This user does not exist"});
    }
  
    const detailId = user.details;
  
    // Checking if they have a UserDetail document, if so, udpate the document. If not, create a new one
    if (detailId) {
      const detailInfo = await UserDetail.findOne({_id: detailId[0]});
      await UserDetail.findByIdAndUpdate(detailId[0],
        {
          fname: details.fname || detailInfo.fname,
          lname: details.lname || detailInfo.lname,
          grade: details.grade || detailInfo.grade,
          about: details.about || detailInfo.about,
          uni: details.uni || detailInfo.uni,
          currentGroups: details.currentGroups || detailInfo.currentGroups,
          pastGroups: details.pastGroups || detailInfo.pastGroups,
       }
      );
      const modDetails = await UserDetail.findById(detailId[0]);
      await User.findByIdAndUpdate(id,
        {
          email: email || user.email,
          password: password || user.password,
        }
      );
      return res.json(modDetails);
    } else {
      const detailInfo = await UserDetail.create(
        {
          fname: details.fname,
          lname: details.lname,
          grade: details.grade,
          about: details.about,
          uni: details.uni,
          currentGroups: details.currentGroups,
          pastGroups: details.pastGroups,
        }
      )
      await User.findByIdAndUpdate(id, 
        {
          email: email || user.email,
          password: password || user.password,
          details: detailInfo
        }
      );
      return res.json(detailInfo);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ message: "User Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router;