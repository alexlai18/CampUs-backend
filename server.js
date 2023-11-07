require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000

app.listen(PORT, () => {
  console.log("Server Running on Port: 5000");
})

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

app.get('/', (req, res) => {
  res.send('Hey this is my API running')
});

db.once('open', () => console.log("Connected to Database"));

app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const coursesRouter = require("./routes/courses");
app.use("/course", coursesRouter);

const notificationsRouter = require("./routes/notifications");
app.use("/notifications", notificationsRouter);

const detailsRouter = require("./routes/details");
app.use("/details", detailsRouter);

const userDetailsRouter = require("./routes/usercourse");
app.use("/usercourse", userDetailsRouter);

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const friendsRouter = require("./routes/friends");
app.use("/friends", friendsRouter);

const groupRouter = require("./routes/group");
app.use("/group", groupRouter);

module.exports = app;