const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");
const nodemailer = require("nodemailer")


const registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser) {
            throw new CustomError("Username or Email already exists!", 400)
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password, salt)
        const newUser = new User({ ...req.body, password: hashedPassword })
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    } catch (error) {

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
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 5 days in milliseconds
        }).status(200).json({ message: "LoggedIn Successfully!", data })



    } catch (error) {
        // res.status(500).json(error)
        next(error)

    }
}

const logoutController = async (req, res, next) => {
    try {
        
        if (!req.cookies.token) {
            throw new CustomError("No Session Found To Logout!", 404)
        }

        res.clearCookie("token", { sameSite: "none", securet: true }).status(200).json("logged out successfully")
    } catch (error) {

        next(error)
    }
}

const userFetchController = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(404).json("Login Session not found")
    } else {
        jwt.verify(token, process.env.SECRET_KEY_JWT, {}, async (err, data) => {
            if (err) {

                res.status(400)
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

}


const passwordResetController = async (req, res, next) => {

    try {

        const { email, newPassword, resetToken } = req.body;

        if (email) {

            const user = await User.findOne({ email });
            if (!user) {
                throw new CustomError("User with this email not found!", 404);
            }

            const resetToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY_JWT, { expiresIn: "15m" });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            // Email

            const mailOptions = {
                from: `"Social Media" <${process.env.EMAIL_USERNAME}>`,
                to: email,
                subject: "Reset Your Password",
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
                        <div style="background-color: #f7f7f7; padding: 20px;">
                            <h2 style="color: #555; text-align: center;">Password Reset Request</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p>Hello ${user.fullName},</p>
                            <p>We received a request to reset your password. Use the token below to reset your password. This token is valid for <strong>15 minutes</strong> only:</p>
                            <p>${resetToken}</p>
                            <p>If you didn’t request this, you can safely ignore this email.</p>
                            <p>Thanks,<br />The Support Team</p>
                        </div>
                        <div style="background-color: #f7f7f7; padding: 10px; text-align: center;">
                            <p style="font-size: 12px; color: #999;">If you have any questions, feel free to contact us.</p>
                            <p style="font-size: 12px; color: #999;">&copy; 2024 Social Media. All rights reserved.</p>
                        </div>
                    </div>
                </div>
                `
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Password reset link sent to your email! Enter resetToken & newPassword and send request again!", note: "Ass user has invalid emails, Token is also made visible here!", resetToken: resetToken });
        }


        if (resetToken && newPassword) {

            jwt.verify(resetToken, process.env.SECRET_KEY_JWT, {}, async (err, decoded) => {
                if (err) {

                    return res.status(400).json(err)
                }

                const user = await User.findById(decoded._id);
                if (!user) {
                    throw new CustomError("User not found!", 404);
                }
                // Hash the new password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

                user.password = hashedPassword;
                await user.save();

                return res.status(200).json({ message: "Password reset successfully!" });
            });
        }

        else {
            throw new CustomError("Invalid request", 400);
        }

    } catch (error) {
        next(error)
    }

};


module.exports = { registerController, loginController, logoutController, userFetchController, passwordResetController };
