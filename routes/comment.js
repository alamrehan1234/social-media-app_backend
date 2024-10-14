const express = require("express")
const router = express.Router();
const { createCommentController, createCommentReplyController,
    updateCommentController, updateCommentReplyController,
    getCommentsByPostController, deleteCommentController,
    deleteCommentReplyController, likeCommentController,
    dislikeCommentController, likeCommentReplyController,
    dislikeCommentReplyController
} = require("../controllers/commentController")

//CREATE COMMENT
router.post("/create", createCommentController)
//CREATE COMMENT REPLY
router.post("/reply/:commentId", createCommentReplyController)
//UPDATE COMMENT
router.put("/update/:commentId", updateCommentController)
//UPDATE COMMENT REPLY
router.put("/update/:commentId/reply/:replyId", updateCommentReplyController)
// GET ALL POST'S COMMENTS
router.get("/post/:postId", getCommentsByPostController)
// DELETE COMMENT
router.delete("/delete/:commentId", deleteCommentController)
//DELETE COMMENT'S REPLY
router.delete("/delete/:commentId/reply/:replyId", deleteCommentReplyController)
//LIKE COMMENT
router.post("/like/:commentId", likeCommentController)
//DISLIKE COMMENT
router.post("/dislike/:commentId", dislikeCommentController)
//LIKE COMMENT'S REPLY
router.post("/like/:commentId/reply/:replyId", likeCommentReplyController)
//DISLIKE COMMENT'S REPLY
router.post("/dislike/:commentId/reply/:replyId", dislikeCommentReplyController)


module.exports = router;