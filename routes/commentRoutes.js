const express = require("express");
const {
  newComment,
  replyComment,
  getBlogSpecificComments,
} = require("../controllers/commentController");
const { verifyUsingJWT } = require("../middleware/jwt");

const route = express.Router();
route.post("/newComment", verifyUsingJWT, newComment);
route.put("/replyComment", verifyUsingJWT, replyComment);
route.get("/getBlogSpecificComments", getBlogSpecificComments);
module.exports = route;
