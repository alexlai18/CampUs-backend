require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const PORT = 5000

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

app.get('/', (req, res) => {
  res.send('Hey this is my API running')
});

db.once('open', () => console.log("Connected to Database"));

app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/api/v1/users", usersRouter);

const coursesRouter = require("./routes/courses");
app.use("/api/v1/course", coursesRouter);

const notificationsRouter = require("./routes/notifications");
app.use("/api/v1/notifications", notificationsRouter);

const detailsRouter = require("./routes/details");
app.use("/api/v1/details", detailsRouter);

const userDetailsRouter = require("./routes/usercourse");
app.use("/api/v1/usercourse", userDetailsRouter);

const loginRouter = require("./routes/login");
app.use("/api/v1/login", loginRouter);

const friendsRouter = require("./routes/friends");
app.use("/api/v1/friends", friendsRouter);

const groupRouter = require("./routes/group");
app.use("/api/v1/group", groupRouter);

const profileImgRouter = require("./routes/profileimg");
app.use("/api/v1/profileImg", profileImgRouter);

app.listen(PORT, () => {
  console.log("Server Running on Port: 5000");
})

module.exports = app;