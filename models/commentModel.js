const mongoose = require("mongoose");

const myCommentSchema = new mongoose.Schema({
  blogId: String,
  commentContent: String,
  commentTime: Date,
  commentUserName: String,
  commentUserId: String,
  replyContent: String,
  replyTime: Date,
  replyUserName: String,
  replyUserId: String,
});

const myCommentModel = mongoose.model("Comments", myCommentSchema);

module.exports = myCommentModel;
