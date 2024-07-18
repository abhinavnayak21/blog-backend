const myBlogModel = require("../models/blogModel");
const cloudinary = require("cloudinary");
const { isEmpty } = require("../common/common");
const jsonwebtoken = require("jsonwebtoken");

cloudinary.config({
  cloud_name: "abhi-jain",
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

// app.get("/fetchSingleBlog", (req, res) => );
function fetchSingleBlog(req, res) {
  const blogId = req.query;
  // userid = {id: "dfsrfef"}; this id will refer to blog id.
  if (Object.hasOwnProperty(blogId, "id") === false && blogId.id.length === 0) {
    return res
      .status(404)
      .send({ message: "You forgot to tell which user's blog you want" });
  }

  myBlogModel
    .findById(blogId.id)
    .then((data) => {
      return res
        .status(200)
        .send({ message: "Blog fetched successfully", blogData: data });
    })
    .catch(() => {
      return res.status(500).send({ message: "Server failed to send blogs" });
    });
}

// app.get("/userSpecificBlogs", (req, res) => );

function userSpecificBlogs(req, res) {
  const userid = req.query;
  jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
    console.log(error);
    if (error !== null) {
      return res.status(404).send({ message: "Token verification failed." });
    }

    if (result !== undefined) {
      // userid = {id: "dfsrfef"}; this id will refer to user id.
      if (
        Object.hasOwnProperty(userid, "id") === false &&
        userid.id.length === 0
      ) {
        return res
          .status(404)
          .send({ message: "You forgot to tell which user's blog you want" });
      }
      myBlogModel
        .find({
          userId: userid.id,
        })
        .then((data) => {
          return res
            .status(200)
            .send({ message: "Blog fetched successfully", blogData: data });
        })
        .catch(() => {
          return res
            .status(500)
            .send({ message: "Server failed to send blogs" });
        });
    }
  });
}

// app.delete("/deleteBlog", (req, res) => );

// app.get("/getAllBlogs", (req, res) => );
function getAllBlogs(req, res) {
  myBlogModel
    .find()
    .then((data) => {
      return res
        .status(200)
        .send({ message: "Blog fetched successfully", blogData: data });
    })
    .catch(() => {
      return res.status(500).send({ message: "Server failed to send blogs" });
    });
}

function deleteBlog(req, res) {
  const blogId = req.query;
  jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
    console.log(error);
    if (error !== null) {
      return res.status(404).send({ message: "Token verification failed." });
    }

    if (result !== undefined) {
      // blogId = {id: "dfsrfef"};
      if (
        Object.hasOwnProperty(blogId, "id") === false &&
        blogId.id.length === 0
      ) {
        return res
          .status(404)
          .send({ message: "You forgot to tell which blog to delete." });
      }

      myBlogModel
        .findByIdAndDelete(blogId.id)
        .then(() => {
          return res
            .status(200)
            .send({ message: "Blog deleted successfully." });
        })
        .catch(() => {
          return res.status(404).send({ message: "Failed to delete Blog" });
        });
    }
  });
}

// app.put("/updateBlog", upload.single("blogImage"), (req, res) => );

function updateBlog(req, res) {
  const blogImage = req.file;
  const body = req.body;
  console.log(body);
  const blogId = req.query;
  jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
    console.log(error);
    if (error !== null) {
      return res.status(404).send({ message: "Token verification failed." });
    }

    if (result !== undefined) {
      // blogId = {id: "dfsrfef"};
      if (
        Object.hasOwnProperty(blogId, "id") === false &&
        blogId.id.length === 0
      ) {
        return res
          .status(404)
          .send({ message: "You forgot to tell which blog to update." });
      }
      if (blogImage !== undefined) {
        cloudinary.v2.uploader
          .upload_stream((error, result) => {
            if (error !== undefined) {
              return res
                .status(500)
                .send({ message: "Server failed to update image." });
            }

            if (isEmpty(body) === true) {
              myBlogModel
                .findByIdAndUpdate(blogId.id, {
                  blogImage: result.url,
                  ...body,
                })
                .then(() => {
                  return res
                    .status(201)
                    .send({ message: "Blog updated successfully" });
                })
                .catch(() => {
                  return res
                    .status(404)
                    .send({ message: "Required Blog does not found." });
                });
            } else {
              myBlogModel
                .findByIdAndUpdate(blogId.id, { blogImage: result.url })
                .then(() => {
                  return res
                    .status(201)
                    .send({ message: "Blog updated successfully" });
                })
                .catch(() => {
                  return res
                    .status(404)
                    .send({ message: "Required Blog does not found." });
                });
            }
          })
          .end(blogImage.buffer);
      } else {
        myBlogModel
          .findByIdAndUpdate(blogId.id, { ...body })
          .then(() => {
            return res
              .status(201)
              .send({ message: "Blog updated successfully" });
          })
          .catch(() => {
            return res
              .status(404)
              .send({ message: "Required Blog does not found." });
          });
      }
    }
  });
}

function newBlog(req, res) {
  const blogImage = req.file;
  const body = req.body;
  console.log(body);
  if (blogImage === undefined) {
    return res.status(404).send({ message: "You forgot to include image." });
  }

  jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
    console.log(error);
    if (error !== null) {
      return res.status(404).send({ message: "Token verification failed." });
    }

    if (result !== undefined) {
      cloudinary.v2.uploader
        .upload_stream((error, result) => {
          if (error !== undefined) {
            return res
              .status(500)
              .send({ message: "Server failed to upload image." });
          }

          const newBlog = myBlogModel({
            blogImage: result.url,
            ...body,
          });
          newBlog
            .save()
            .then(() => {
              return res
                .status(201)
                .send({ message: "Congratulations for new blog." });
            })
            .catch(() => {
              return res
                .status(500)
                .send({ message: "Server failed to save blog." });
            });
        })
        .end(blogImage.buffer);
    }
  });
}

// app.post("/newBlog", upload.single("blogImage"), (req, res) => );
const obj = {
  newBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  userSpecificBlogs,
  fetchSingleBlog,
};
module.exports = obj;
