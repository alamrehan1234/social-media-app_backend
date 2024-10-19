const { CustomError } = require("../middlewares/error")
const models = require("../models/models")

const createPostController = async (req, res, next) => {
    const { userId, caption } = req.body;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("User not found", 404)
        }
        const newPost = new models.Post({
            user: userId,
            caption
        })
        await newPost.save()
        user.posts.push(newPost._id)
        await user.save()
        res.status(201).json({ message: "Post Created successfully!", post: newPost })
    } catch (error) {
        next(error);
    }
}

const createPostWithImagesController = async (req, res, next) => {
    const { userId } = req.params;
    const { caption } = req.body;
    // const files = req.files;

    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("User not found", 404)
        }

        if (!req.filesUploadedUrls) {
            return res.status(500).send({ error: 'image URLS not available' });
        }


        if (!req.filesUploadedUrls.every(el => el.includes("/images%2Fpost%2F"))) {

            return res.status(400).send({ error: "uploaded file's fieldname invalid for this route" });
        }

        const postImagesUrls = req.filesUploadedUrls;

        const newPost = new models.Post({
            user: userId,
            caption,
            image: postImagesUrls
        })
        await newPost.save()
        user.posts.push(newPost._id)
        await user.save()

        res.status(201).json({ message: "Post with Images Created successfully!", }) //post: newPost

    } catch (error) {
        next(error);
    }
}

const updatePostController = async (req, res, next) => {
    const { postId } = req.params;
    const { caption } = req.body;
    try {
        const postToUpdate = await models.Post.findById(postId)

        if (!postToUpdate) {
            throw new CustomError("Post not found", 404)
        }

        // postToUpdate.caption = caption || postToUpdate.caption
        const updatedPost = await models.Post.findByIdAndUpdate(
            postId,
            { caption },
            { new: true }

        );

        res.status(200).json({ message: "post updated successfully!", post: updatedPost })

    } catch (error) {
        next(error)
    }
}

const getPostsController = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("User not found", 404)
        }
        const blockedUserIds = user.blocklist.map(id => id.toString())

        const allPosts = await models.Post.find({ user: { $nin: blockedUserIds } }).populate("user", "username fullName profilePicture")
        if (!allPosts) {
            throw new CustomError("posts not found", 404)
        }
        res.status(200).json({ message: `${allPosts.length} post(s) feteched !`, posts: allPosts })
    } catch (error) {
        next(error)
    }
}

const getUserPostsController = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("User not found", 404)
        }

        const allPosts = await models.Post.find({ user: userId })

        if (!allPosts) {
            throw new CustomError("posts not found", 404)
        }
        res.status(200).json({ message: `${allPosts.length} post(s) feteched !`, posts: allPosts })
    } catch (error) {
        next(error)
    }
}

const deletePostController = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const postToDelete = await models.Post.findById(postId)
        if (!postToDelete) {
            throw new CustomError("Post not found", 404)
        }
        const user = await models.User.findById(postToDelete.user)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        user.posts = user.posts.filter(postId => postId.toString() !== postToDelete._id.toString())
        await user.save()
        await postToDelete.deleteOne()

        res.status(200).json({ message: ` post deleted successfully!`, posts: postToDelete })
    } catch (error) {
        next(error)
    }
}

const likePostController = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.body;
    try {
        const postToLike = await models.Post.findById(postId)
        if (!postToLike) {
            throw new CustomError("Post not found", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        if (postToLike.likes.includes(userId)) {
            throw new CustomError("You have alreday liked the Post!", 400)
        }
        postToLike.likes.push(userId)
        await postToLike.save()
        res.status(200).json({ message: "Post liked successfully!", post: postToLike })

    } catch (error) {
        next(error)
    }
}

const dislikePostController = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.body;
    try {
        const postToDislike = await models.Post.findById(postId)
        if (!postToDislike) {
            throw new CustomError("Post not found", 404)
        }
        const user = await models.User.findById(userId)
        if (!user) {
            throw new CustomError("user not found", 404)
        }
        if (!postToDislike.likes.includes(userId)) {
            throw new CustomError("You have not liked the Post yet!", 400)
        }
        postToDislike.likes = postToDislike.likes.filter(id => id.toString() !== userId)
        await postToDislike.save()
        res.status(200).json({ message: "Post disliked successfully!", post: postToDislike })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    createPostController, createPostWithImagesController, updatePostController,
    getPostsController, getUserPostsController, deletePostController,
    likePostController, dislikePostController
}