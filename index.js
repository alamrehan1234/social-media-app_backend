const express = require("express")
const app = express();
const connection = require("./database/db")
require("dotenv").config();
const cookieParser = require("cookie-parser")
const path = require("path")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const postRoute = require("./routes/post")
const commentRoute = require("./routes/comment")
const storyRoute = require("./routes/story")
const conversationRoute = require("./routes/conversation")
const messageRoute = require("./routes/message")

app.use(express.json())
app.use(cookieParser())
const { errorHandler } = require("./middlewares/error")
const veriftToken = require("./middlewares/verifyToken")

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use("/api/auth", authRoute)
app.use("/api/user", veriftToken, userRoute)
app.use("/api/post", veriftToken, postRoute)
app.use("/api/comment", veriftToken, commentRoute)
app.use("/api/story", veriftToken, storyRoute)
app.use("/api/conversation", veriftToken, conversationRoute)
app.use("/api/message", veriftToken, messageRoute)

app.use(errorHandler)

app.get("/", (req, res) => {
    res.send("root working!")
})

app.listen(process.env.PORT, async (req, res) => {
    await connection();
    console.log("app is running")
})