const mongoose = require("mongoose");

const myUserSchema = new mongoose.Schema({
  username: String,
  useremail: String,
  password: String,
});

const myUserModel = mongoose.model("User", myUserSchema);
module.exports = myUserModel;
