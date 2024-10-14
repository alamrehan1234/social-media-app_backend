const models = require("../models/models")
const { CustomError } = require("../middlewares/error");


const createNewConversationController = async (req, res, next) => {
    const { firstUser, secondUser } = req.body;
    try {
        let newConversation;

        if (!(firstUser) || !(secondUser)) {
            throw new CustomError("sender or receiver or both can not be undefined!", 400)
        }

        const user1 = await models.User.findById(firstUser)
        if (!user1) {
            throw new CustomError("First Participant not found", 404)
        }

        const user2 = await models.User.findById(secondUser)
        if (!user2) {
            throw new CustomError("Second participant not found", 404)
        }
        const conversation = await models.Conversation.find({
            participants: { $all: [firstUser, secondUser] }
        })
        if (conversation.length !== 0) {
            throw new CustomError(`Conversation exists!`, 400)
        }
        if (firstUser !== secondUser) {

            newConversation = new models.Conversation({
                participants: [firstUser, secondUser]
            })
        } else {
            throw new CustomError("sender and receiver can not be same!", 400)
        }

        const savedConversation = await newConversation.save()

        res.status(201).json(savedConversation)

    } catch (error) {
        next(error)
    }
}

const getUserConversationController = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        const conversations = await models.Conversation.find({
            participants: { $in: [userId] }
        })
        res.status(200).json({ message: `${conversations.length} conversations feteched!`, conversations })
    } catch (error) {
        // next(error)
        console.log(error)
    }
}

const getTwoUserConversationController = async (req, res, next) => {
    const { firstUserId, secondUserId } = req.params;
    try {

        if (!(firstUserId) || !(secondUserId)) {
            throw new CustomError("sender or receiver or both can not be undefined!", 400)
        }

        const user1 = await models.User.findById(firstUserId)
        if (!user1) {
            throw new CustomError("First Participant not found", 404)
        }

        const user2 = await models.User.findById(secondUserId)
        if (!user2) {
            throw new CustomError("Second participant not found", 404)
        }

        if (firstUserId === secondUserId) {
            throw new CustomError("sender and receiver can not be same!", 400)
        }

        const conversation = await models.Conversation.find({
            participants: { $all: [firstUserId, secondUserId] }
        })

        res.status(200).json(conversation)

    } catch (error) {
        next(error)
    }
}

const deleteConversationController = async (req, res, next) => {
    const { conversationId } = req.params;

    const { userId } = req.body;
    try {

        const conversation = await models.Conversation.findById(conversationId)
        if (!conversation) {
            throw new CustomError("conversation not found!", 404)
        }

        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        if (conversation.participants.includes(user._id)) {
            await conversation.deleteOne()
            await models.Message.deleteMany({ conversationId: conversationId })
        } else {
            throw new CustomError("Unauthorized! You can delete only your's conversation!")
        }
        res.status(200).json({ message: "Conversation deletd successfully", conversation })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    createNewConversationController, getUserConversationController,
    getTwoUserConversationController, deleteConversationController
}