const models = require("../models/models")
const { CustomError } = require("../middlewares/error")

const createStoryController = async (req, res, next) => {
    const { userId } = req.params;
    const { text } = req.body;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        let image = "";
        if (req.file) {
            image = process.env.URL + `/assets/images/${req.file.filename}`
        }
        const newStory = new models.Story({
            user: userId,
            text,
            image
        })

        await newStory.save();
        res.status(201).json(newStory)

    } catch (error) {
        // next(error)
        console.log(error)
    }
}

const getStoriesController = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        const followingUsers = user.following;

        const stories = await models.Story.find({ user: { $in: followingUsers } })
            .populate("user", "username fullName profilePicture")

        res.status(200).json({ message: `${stories.length} Stories fetched!`, stories })

    } catch (error) {
        next(error)
    }
}

const getUserStoriesController = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        const stories = await models.Story.find({ user: userId })
            .populate("user", "username fullName profilePicture")

        if (stories.length === 0) {
            res.status(200).json({ message: "No story updated by user!" })
        }
        res.status(200).json({ message: `${stories.length} Storie(s) are feteched!`, stories })
    } catch (error) {
        next(error)
    }
}

const deleteStoryController = async (req, res, next) => {
    const { storyId } = req.params;
    const { userId } = req.body;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        const story = await models.Story.findById(storyId)
        if (!story) {
            throw new CustomError("story not found", 404)
        }
        if (story.user.toString() !== userId) {
            throw new CustomError("Unauthorized! You cannot delete others story", 400)
        }
        await story.deleteOne();

        res.status(200).json({ message: "Story deleted successfully!", story })
    } catch (error) {
        next(error)
    }
}

const deleteUserStoriesController = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }

        const story = await models.Story.find({ user: userId })
        if (story.length === 0) {
            throw new CustomError("no stories found", 404)
        }
        console.log(story)

        await models.Story.deleteMany({ user: userId })
        console.log("delete")
        res.status(200).json({ message: "all user's associated stories are deleted successfully" })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createStoryController, getStoriesController, getUserStoriesController,
    deleteStoryController, deleteUserStoriesController
}