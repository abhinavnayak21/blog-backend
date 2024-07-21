const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const cors = require("cors");
const app = express();


// parse application/json
app.use(bodyParser.json());

app.use(cors());
// Enable All CORS Requests (for demonstration purposes)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specified methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
  next();
});

app.use("/comment", commentRoutes);
app.use("/blog", blogRoutes);
app.use("/user", userRoutes);

mongoose
  .connect(
    "mongodb+srv://abhinavnayak21:qwerty123@cluster0.4ooquco.mongodb.net/"
  )
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((eror) => {
    console.log(eror);
    console.log("Mongodb Failed to Connect");
  });

app.listen(5000, () => {
  console.log("Server is started listening at port 5000.");
});
