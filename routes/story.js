const express = require("express")
const router = express.Router()
const { createStoryController } = require("../controllers/storyController")
const upload = require("../middlewares/upload")


//CREATE STORY
router.post("/create/:userId", upload.single("image"), createStoryController)






module.exports = router