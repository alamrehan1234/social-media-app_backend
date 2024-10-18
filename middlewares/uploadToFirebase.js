const multer = require("multer");
const { bucket } = require("../config/firebaseConfig"); // Import the bucket reference
const path = require("path")
// Set up multer storage to handle incoming files
const storage = multer.memoryStorage(); // Use memory storage to handle file uploads in memory

const upload = multer({ storage: storage }).any()

// Middleware function to upload file to Firebase Storage
const uploadToFirebase = async (req, res, next) => {

    try {

        await upload(req, res, async (err) => {

            if (err) {
                console.error("Multer Error:", err); // Log any multer errors
                return res.status(500).send({ error: "File upload failed." });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).send({ error: "No file uploaded." });
            }

            //Check if uploaded file format is allowed
            if (!req.files.every(el => ["image/png", "image/jpeg"].includes(el.mimetype))) {
                return res.status(400).send({ error: "invalid file format/extention, only jpeg/jpg or png is allowed!" });
            }

            // Check if uploading files fieldname is allowed
            if (!req.files.every(el => ["coverPicture", "profilePicture", "story", "post"].includes(el.fieldname))) {
                return res.status(400).send({ error: "uploaded file's fieldname invalid" });
            }

            // Check if uploadling profilePicture or coverPicture is not more than 1 file.
            if (req.files.some(el => ["coverPicture", "profilePicture", "story"].includes(el.fieldname)) && req.files.length >= 2) {
                return res.status(400).send({ error: "only single file is allowed for cover or profile picture" });
            }
            try {
                // Create a file reference in Firebase Storage

                let file = undefined;
                if (req.files[0].fieldname === "story") {
                    file = bucket.file(`images/${req.files[0].fieldname}/${req.params.userId}/${req.files[0].fieldname}-${Date.now()}${path.extname(req.files[0].originalname)}`);

                } else {
                    file = bucket.file(`images/${req.files[0].fieldname}/${req.files[0].fieldname}-${Date.now()}${path.extname(req.files[0].originalname)}`);
                }

                // Create a stream to upload the file to Firebase Storage
                const stream = file.createWriteStream({
                    metadata: {
                        contentType: req.files[0].mimetype, // Set the content type from multer

                        metadata: {
                            originalName: req.files[0].originalname // Custom metadata field for original name
                        }
                    },
                });
                // Handle errors during the upload
                stream.on("error", (uploadError) => {
                    console.error("Error uploading file to Firebase:", uploadError);
                    return res.status(500).send({ error: "Error uploading file to Firebase." });
                });

                // Handle the completion of the upload
                stream.on("finish", async () => {
                    console.log("File uploaded successfully to Firebase Storage.");

                    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                    req.imageUrl = publicUrl;
                    next()
                });

                // Pipe the file buffer to the stream
                stream.end(req.files[0].buffer); // Upload the file buffer

            } catch (error) {
                console.error("Upload failed:", error);
                return res.status(500).send({ error: "Upload failed." });
            }
        })
    } catch (error) {
        // next(error)
        console.log(error)
    }
};

module.exports = uploadToFirebase; // Export the middleware function
