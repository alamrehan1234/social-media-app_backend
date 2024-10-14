const express = require("express")
const router = express.Router()

const { createStoryController, getStoriesController,
    getUserStoriesController, deleteStoryController,
    deleteUserStoriesController
} = require("../controllers/storyController")

const upload = require("../middlewares/upload")


//CREATE STORY
router.post("/create/:userId", upload.single("image"), createStoryController)
//GET ALL STORIES
router.get("/all/:userId", getStoriesController)
//GET USER'S STORIES
router.get("/user/:userId", getUserStoriesController)
//DELETE A STORY
router.delete("/delete/:storyId", deleteStoryController)
//DELETE USER'S STORIES
router.delete("/all/:userId/delete", deleteUserStoriesController)


module.exports = router