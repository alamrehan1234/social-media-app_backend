const express = require("express")
const router = express.Router()
const { createMessageController, getConversationMessageController,
    deleteMessageController
} = require("../controllers/messageController")

//CREATE MESSAGE
router.post("/create", createMessageController)
// GET CONVERSATION'S MESSAGES
router.get("/:conversationId", getConversationMessageController)
//DELETE MESSAGE
router.delete("/:messageId/delete", deleteMessageController)


module.exports = router