const express = require("express")
const router = express.Router();

const uploadMultipleToFirebase = require("../middlewares/uploadMultipleToFirebase.js")

const { createPostController, createPostWithImagesController,
    updatePostController, getPostsController,
    getUserPostsController, deletePostController,
    likePostController, dislikePostController
} = require("../controllers/postController")

//CREATE POST
router.post("/create", createPostController)
//CREATE POST WITH IMAGES
router.post("/create/:userId", uploadMultipleToFirebase, createPostWithImagesController)
//UPDATE POST
router.put("/update/:postId", updatePostController)
//GET ALL POSTS
router.get("/all/:userId", getPostsController)
//GET ALL POST OF AN INDIVIDUAL USER
router.get("/user/:userId", getUserPostsController)
//DELETE POST
router.delete("/delete/:postId", deletePostController)
// LIKE POST
router.post("/like/:postId", likePostController)
// DISLIKE POST
router.post("/dislike/:postId", dislikePostController)
module.exports = router