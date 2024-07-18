const mongoose = require("mongoose");

const myBlogSchema = new mongoose.Schema({
  blogImage: String,
  userId: String,
  uploadDate: Date,
  h1: String,
  p1: String,
  h2: String,
  p2: String,
  h3: String,
  p3: String,
});

const myBlogModel = mongoose.model("Blogs", myBlogSchema);
module.exports = myBlogModel;
