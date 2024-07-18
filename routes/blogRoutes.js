const express = require("express");
const {
  getAllBlogs,
  fetchSingleBlog,
  userSpecificBlogs,
  updateBlog,
  deleteBlog,
  newBlog,
} = require("../controllers/blogController");
const { verifyUsingJWT } = require("../middleware/jwt");
const upload = require("../middleware/multer");
const route = express.Router();

route.get("/getAllBlogs", getAllBlogs);
route.delete("/deleteBlog", verifyUsingJWT, deleteBlog);
route.get("/userSpecificBlogs", verifyUsingJWT, userSpecificBlogs);
route.get("/fetchSingleBlog", fetchSingleBlog);
route.put(
  "/updateBlog",
  verifyUsingJWT,
  upload.single("blogImage"),
  updateBlog
);
route.post("/newBlog", verifyUsingJWT, upload.single("blogImage"), newBlog);
module.exports = route;
