const express = require("express")
const router = express.Router();
const { createNewConversationController, getUserConversationController,
    getTwoUserConversationController, deleteConversationController
} = require("../controllers/conversationController")

//NEW CONVERSATION
router.post("/create", createNewConversationController)
//GET USER'S CONVERSATION
router.get("/:userId", getUserConversationController)
//GET CONVERSATION OF TWO PARTICIPANT ENVOLVED
router.get("/:firstUserId/:secondUserId", getTwoUserConversationController)
//DELETE CONVERSATION
router.delete("/:conversationId/delete", deleteConversationController)

module.exports = router