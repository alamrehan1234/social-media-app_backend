const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.status).json({ error: err.message })
    }
    let { status = 500, message = "some error occoured" } = err;

    return res.status(status).json({ error: message })
}

class CustomError extends Error {
    constructor(message, status = 500) {
        super(message)
        this.name = this.constructor.name
        this.status = status
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = { errorHandler, CustomError }