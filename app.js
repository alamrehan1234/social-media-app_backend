const express = require("express")
const cors = require("cors");
const app = express();

const connection = require("./database/db")
require("dotenv").config();
const cookieParser = require("cookie-parser")
app.use(cookieParser())

const verifyToken = require("./middlewares/verifyToken")

const path = require("path")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const postRoute = require("./routes/post")
const commentRoute = require("./routes/comment")
const storyRoute = require("./routes/story")
const conversationRoute = require("./routes/conversation")
const messageRoute = require("./routes/message")


app.use(cors({
    origin: '*', // Allow all origins/domains
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));


app.use(express.json())
const { errorHandler } = require("./middlewares/error")

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use("/api/auth", authRoute)
app.use("/api/user", verifyToken, userRoute)
app.use("/api/post", verifyToken, postRoute)
app.use("/api/comment", verifyToken, commentRoute)
app.use("/api/story", verifyToken, storyRoute)
app.use("/api/conversation", verifyToken, conversationRoute)
app.use("/api/message", verifyToken, messageRoute)

app.use(errorHandler)

app.get("/", verifyToken, (req, res) => {
    res.send("root working!")
})

app.listen(process.env.PORT, async (req, res) => {
    await connection();
    console.log("app is running")
})