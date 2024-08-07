// for using environment variables
require("dotenv").config();
// importing dependencies
const express = require("express");
const cookieParser = require("cookie-parser");

// importing the routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

// 1. this is the port on which the server will run
const port = process.env.PORT || 8080;

// creating the express app
const app = express();

// 2. adding middleware to parse the cookies and more
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 3. adding the routes
app.use("/", indexRouter);
app.use("/auth", authRouter);

// 4. starting the server
app.listen(port, function () {
  console.log(`🚀 Listening on port ${port}`);
});

const mongoose = require("mongoose");
// connecting to the database
console.log(process.env.MONGO_URI)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection is established successfully! 🎉");
  });

