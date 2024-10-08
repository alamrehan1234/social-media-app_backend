const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");


const registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser) {
            // res.status(400).json("Username or email id already exists!")
            throw new CustomError("Username or Email already exists!", 400)
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password, salt)
        const newUser = new User({ ...req.body, password: hashedPassword })
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    } catch (error) {
        // res.status(500).json(error)
        next(error);
    }
}

const loginController = async (req, res, next) => {
    try {
        let user;
        if (req.body.email) {
            user = await User.findOne({ email: req.body.email })
        }
        else if (req.body.username) {
            user = await User.findOne({ username: req.body.username })
        }

        if (!user) {
            // res.status(404).json("user not found")
            throw new CustomError("User not found", 404)
        }
        const match = await bcrypt.compare(req.body.password, user.password)

        if (!match) {
            // res.status(401).json(`bad auth: wrong credentials`)
            throw new CustomError("wrong credentials", 401)
        }
        const { password, ...data } = user._doc;
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY_JWT, { expiresIn: process.env.EXPIRY_KEY_JWT })
        res.cookie("token", token).status(200).json(data)



    } catch (error) {
        // res.status(500).json(error)
        next(error)

    }
}

const logoutController = async (req, res, next) => {
    try {
        res.clearCookie("token", { sameSite: "none", securet: true }).status(200).json("logged out successfully")
    } catch (error) {
        // res.status(500).json(error)
        next(error)
    }
}

const userFetchController = async (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY_JWT, {}, async (err, data) => {
        if (err) {
            // res.status(500).json(err)

            // throw new CustomError(err, 500)

            res.status(500)
        }
        try {

            const id = data._id
            const user = await User.findOne({ _id: id })
            res.status(200).json(user)

        } catch (error) {
            // res.status(501).json(error)
            next(error)
        }
    })
}

module.exports = { registerController, loginController, logoutController, userFetchController };