const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "assets/images/")
    },
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname)
        callback(null, `${file.fieldname}-${Date.now()}${ext}`)
    }

})

const upload = multer({ storage: storage })

module.exports = upload