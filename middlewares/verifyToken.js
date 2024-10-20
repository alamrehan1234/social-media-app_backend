const jwt = require("jsonwebtoken")
const { CustomError } = require("./error")

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new CustomError("You are not authorized!", 401);
    }
    jwt.verify(token, process.env.SECRET_KEY_JWT, async (err, data) => {
        if (err) {
            throw new CustomError("Token is not valid!", 401);
        }
        req.userId = data._id;
        next();
    })
}

module.exports = verifyToken;

