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

app.use(express.json())
app.use(cookieParser())
const { errorHandler } = require("./middlewares/error")

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)
app.use("/api/story", storyRoute)
app.use(errorHandler)

app.get("/", (req, res) => {
    res.send("root working!")
})

app.listen(process.env.PORT, async (req, res) => {
    await connection();
    console.log("app is running")
})