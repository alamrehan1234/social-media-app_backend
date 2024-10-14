const { CustomError } = require("../middlewares/error.js")
const models = require("../models/models")

const createCommentController = async (req, res, next) => {
    const { userId, postId, text } = req.body;
    try {
        const post = await models.Post.findById(postId)
        if (!post) {
            throw new CustomError("Post not found", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }

        const newComment = new models.Comment({
            user: userId,
            post: postId,
            text,
        })

        await newComment.save()
        post.comments.push(newComment._id)
        await post.save()

        res.status(201).json({ message: "comment created successfully!", comment: newComment })

    } catch (error) {
        next(error)
    }
}


const createCommentReplyController = async (req, res, next) => {
    const { commentId } = req.params;
    const { userId, text } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        const reply = {
            text,
            user: userId
        }
        comment.replies.push(reply)
        await comment.save()
        res.status(201).json({ message: "Reply created successfully!", reply })

    } catch (error) {
        next(error)
    }

}

const updateCommentController = async (req, res, next) => {
    const { commentId } = req.params;
    const { text, userId } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }
        if (userId !== comment.user.toString()) {
            throw new CustomError("Unauthorized ! You can only update your own Comment", 400)
        }
        const updateComment = await models.Comment.findByIdAndUpdate(commentId, { text }, { new: true })
        res.status(201).json({ message: "Comment updated successfully!", updateComment })
    } catch (error) {
        next(error);
    }
}
const updateCommentReplyController = async (req, res, next) => {
    const { commentId, replyId } = req.params;
    const { text, userId } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }
        const replyIndex = comment.replies.findIndex((reply) => reply._id.toString() === replyId)
        if (replyIndex === -1) {
            throw new CustomError("Comment's Reply not found!", 404)
        }
        if (comment.replies[replyIndex].user.toString() !== userId) {
            throw new CustomError("Unauthorized ! You can only update your own Reply", 400)
        }
        comment.replies[replyIndex].text = text;
        await comment.save()

        res.status(200).json({ message: "Comment's Reply updated successfully!", comment })
    } catch (error) {
        next(error)
    }
}
const populateUserDetails = async (comments) => {
    for (const comment of comments) {
        await comment.populate("user", "username fullName profilePicture")
        if (comment.replies.length > 0) {
            await comment.populate("replies.user", "username fullName profilePicture")
        }
    }
}
const getCommentsByPostController = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await models.Post.findById(postId)
        if (!post) {
            throw new CustomError("Post not found", 404)
        }
        let comments = await models.Comment.find({ post: postId })

        await populateUserDetails(comments)

        res.status(200).json({ comments })

    } catch (error) {
        next(error)
    }
}

const deleteCommentController = async (req, res, next) => {
    const { commentId } = req.params;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }
        const post = await models.Post.findById(comment.post)

        // const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId)
        // if (commentIndex === -1) {
        //     throw new CustomError("Post's Comment not found!", 404)
        // }

        // Update post's comments list
        //method 1

        await models.Post.findOneAndUpdate(
            { comments: commentId },
            { $pull: { comments: commentId } },
            { new: true }
        )
        //or method 2

        // post.comments = post.comments.filter(id => id.toString() !== commentId)
        // await post.save()

        await comment.deleteOne()

        res.status(200).json({ message: "Comment deleted successfully!", deletedComment: comment })

    } catch (error) {
        next(error)
    }
}

const deleteCommentReplyController = async (req, res, next) => {
    const { commentId, replyId } = req.params;
    const { userId } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }

        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId)
        if (replyIndex === -1) {
            throw new CustomError("Comment's Reply not found!", 404)
        }
        if (comment.replies[replyIndex].user.toString() !== userId) {
            throw new CustomError("Unauthorized ! You can only delete your own Reply", 400)
        }

        comment.replies = comment.replies.filter(reply => reply._id.toString() !== replyId);
        await comment.save()

        res.status(200).json({ message: "Comment's Reply Deleted successfully!", comment })

    } catch (error) {
        next(error)
    }
}

const likeCommentController = async (req, res, next) => {
    const { commentId } = req.params;
    const { userId } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        if (comment.likes.includes(userId)) {
            throw new CustomError("You have already liked the comment!", 400)
        }
        comment.likes.push(userId);
        await comment.save()

        res.status(200).json({ message: "Successfully liked the Comment!", comment })
    } catch (error) {
        next(error)
    }
}


const dislikeCommentController = async (req, res, next) => {
    const { commentId } = req.params;
    const { userId } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        if (!comment.likes.includes(userId)) {
            throw new CustomError("You have not liked the comment yet!", 400)
        }

        comment.likes = comment.likes.filter(id => id.toString() !== userId)
        await comment.save()

        res.status(200).json({ message: "Successfully disliked the Comment!", comment })
    } catch (error) {
        next(error)
    }
}

const likeCommentReplyController = async (req, res, next) => {
    const { commentId, replyId } = req.params;
    const { userId } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }

        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId)
        if (replyIndex === -1) {
            throw new CustomError("Comment's Reply not found!", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        if (comment.replies[replyIndex].likes.includes(userId)) {
            throw new CustomError("You have already liked the comment's Reply!", 400)
        }
        comment.replies[replyIndex].likes.push(userId)
        await comment.save()

        res.status(200).json({ message: "Successfully liked the Comment's Reply!", comment })
    } catch (error) {
        next(error)
    }
}

const dislikeCommentReplyController = async (req, res, next) => {
    const { commentId, replyId } = req.params;
    const { userId } = req.body;
    try {
        const comment = await models.Comment.findById(commentId)
        if (!comment) {
            throw new CustomError("Comment not found!", 404)
        }

        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId)
        if (replyIndex === -1) {
            throw new CustomError("Comment's Reply not found!", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        if (!comment.replies[replyIndex].likes.includes(userId)) {
            throw new CustomError("You have not liked the comment's Reply yet!", 400)
        }

        comment.replies[replyIndex].likes = comment.replies[replyIndex].likes.filter(id => id.toString() !== userId)
        await comment.save()

        res.status(200).json({ message: "Successfully disliked the Comment's Reply!", comment })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    createCommentController, createCommentReplyController,
    updateCommentController, updateCommentReplyController,
    getCommentsByPostController, deleteCommentController,
    deleteCommentReplyController, likeCommentController,
    dislikeCommentController, likeCommentReplyController,
    dislikeCommentReplyController
}