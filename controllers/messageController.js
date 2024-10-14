const models = require("../models/models")
const { CustomeError } = require("../middlewares/error")

const createMessageController = async (req, res, next) => {
    const newMessage = new models.Message(req.body)
    try {
        const savedMessage = await newMessage.save()

        res.status(201).json(savedMessage)
    } catch (error) {
        next(error)
    }
}

const getConversationMessageController = async (req, res, next) => {
    try {
        const messages = await models.Message.find({ conversationId: req.params.conversationId })
        res.status(200).json(messages)
    } catch (error) {
        next(error)
    }
}

const deleteMessageController = async (req, res, next) => {
    try {
        await models.Message.findByIdAndDelete(req.params.messageId)
        res.status(200).json({ message: "message Deleted successfully!" })
    } catch (error) {
        next(error)
    }
}

module.exports = { createMessageController, getConversationMessageController, deleteMessageController }