const models = require("../models/models")
const CustomError = require("../middlewares/error")

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
        next(error)
    }
}



module.exports = { createStoryController }