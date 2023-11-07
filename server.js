require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.once('open', () => console.log("Connected to Database"))

app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const coursesRouter = require("./routes/courses");
app.use("/course", coursesRouter);

app.listen(5000, () => {
  console.log("Server Running on Port: 5000");
})