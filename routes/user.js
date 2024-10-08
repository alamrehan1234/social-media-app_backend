const express = require("express")
const router = express.Router();
const { getUserController, updateUserController,
    followUserController, unfollowUserController,
    blockUserController, unBlockUserController,
    getBlocklistController, deleteUserController,
    searchUserController, uploadProfilePictureController,
    uploadCoverPictureController } = require("../controllers/userController")

const upload = require("../middlewares/upload")

// GET USER
router.get("/:userId", getUserController)
// UPDATE USER
router.put("/update/:userId", updateUserController)
// FOLLOW USER
router.post("/follow/:userId", followUserController)
// UNFOLLOW USER
router.put("/unfollow/:userId", unfollowUserController)
// BLOCK USER
router.put("/block/:userId", blockUserController)
// UNBLOCK USER
router.put("/unblock/:userId", unBlockUserController)
//GET BLOCKLIST
router.get("/blocklist/:userId", getBlocklistController)
// DELETE USER
router.delete("/delete/:userId", deleteUserController)
//SEARCH USER
router.get("/search/:query", searchUserController)
// UPDATE PROFILE PICTURE
router.put("/upload-profile-picture/:userId", upload.single("profilePicture"), uploadProfilePictureController)
// UPDATE COVER PICTURE
router.put("/upload-cover-picture/:userId", upload.single("coverPicture"), uploadCoverPictureController)


module.exports = router