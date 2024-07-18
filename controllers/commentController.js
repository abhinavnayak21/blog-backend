const myCommentModel = require("../models/commentModel");
const { isEmpty } = require("../common/common");
const jsonwebtoken = require("jsonwebtoken");

// app.post("/newComment", (req, res) => );

// app.put("/replyComment", verifyUsingJWT, (req, res) => );

// app.get("/getBlogSpecificComments", (req, res) =>);

function getBlogSpecificComments(req, res) {
  const blogId = req.query;
  if (
    Object.hasOwnProperty(blogId, "blogId") === false &&
    blogId.blogId.length === 0
  ) {
    return res.status(404).send({
      message: "You forgot to tell which blog's comment you want to fetch.",
    });
  }

  myCommentModel
    .find({ blogId: blogId.blogId })
    .then((data) => {
      console.log(data);
      return res
        .status(200)
        .send({ message: "Here are your comments", data: data });
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ message: "Server failed to fetch comments" });
    });
}

function replyComment(req, res) {
  const body = req.body;
  const commentId = req.query;
  console.log(req.token);
  jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
    if (error !== null) {
      return res.status(404).send({ message: "Token verification failed." });
    }
    if (result !== undefined) {
      // userid = {id: "dfsrfef"}; this id will refer to blog id.
      if (
        Object.hasOwnProperty(commentId, "commentId") === false &&
        commentId.commentId.length === 0
      ) {
        return res.status(404).send({
          message: "You forgot to tell which blog's comment you are writing.",
        });
      }

      if (isEmpty(body)) {
        return res
          .status(404)
          .send({ message: "You forgot to tell what reply you are writing." });
      }

      myCommentModel
        .findByIdAndUpdate(commentId.commentId, { ...body })
        .then(() => {
          return res.status(201).send({ message: "Successfully saved reply." });
        })
        .catch((error) => {
          console.log(error);
          return res
            .status(500)
            .send({ message: "Server failed to store your reply." });
        });
    } else {
      return res.status(404).send({ message: "Token verification failed." });
    }
  });
}

function newComment(req, res) {
  const body = req.body;
  const blogId = req.query;
  console.log(body, blogId);
  // userid = {id: "dfsrfef"}; this id will refer to blog id.

  jsonwebtoken.verify(req.token, process.env.SECRETKEY, (error, result) => {
    console.log(error);
    if (error !== null) {
      return res.status(404).send({ message: "Token verification failed." });
    }

    if (result !== undefined) {
      if (
        Object.hasOwnProperty(blogId, "blogId") === false &&
        blogId.blogId.length === 0
      ) {
        return res.status(404).send({
          message: "You forgot to tell which blog's comment you are writing.",
        });
      }

      if (isEmpty(body)) {
        return res.status(404).send({
          message: "You forgot to tell what comment you are writing.",
        });
      }

      const newComment = myCommentModel({ blogId: blogId.blogId, ...body });
      newComment
        .save()
        .then(() => {
          return res
            .status(201)
            .send({ message: "Successfully stored comment" });
        })
        .catch((error) => {
          console.log(error);
          return res
            .status(500)
            .send({ message: "Server failed to store your comment" });
        });
    } else {
      return res.status(404).send({ message: "Token verification failed." });
    }
  });
}
module.exports = { newComment, replyComment, getBlogSpecificComments };
