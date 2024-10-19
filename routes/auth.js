const express = require("express")
const router = express.Router();
const { registerController, loginController,
    logoutController, userFetchController, passwordResetController } = require("../controllers/authController")

// Register
router.post("/register", registerController)
// Login
router.post("/login", loginController)
//Logout
router.get("/logout", logoutController)
// fetch current user
router.get("/refetch", userFetchController)

// password reset functionality
router.post('/password-reset', passwordResetController);

module.exports = router;