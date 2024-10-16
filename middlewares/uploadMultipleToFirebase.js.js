const multer = require("multer");
const { bucket } = require("../config/firebaseConfig");
const path = require("path")

const storage = multer.memoryStorage();

// Set up multer to handle multiple fields with dynamic names and maxCount
const upload = multer({ storage: storage }).any(); // 'any' allows any number of files with different field names

const uploadMultipleToFirebase = (req, res, next) => {
    try {
        upload(req, res, async (err) => {
            const userId = req.params.userId
            if (err) {
                return res.status(500).send({ error: "File upload failed." });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).send({ error: "No files uploaded." });
            }

            // List to store public URLs of all uploaded files
            const uploadedFiles = [];

            // Loop over all files in req.files
            for (const file of req.files) {
                const publicUrl = await uploadFileToFirebase(file, userId); // Upload each file to Firebase
                if (publicUrl) {
                    uploadedFiles.push(publicUrl); // Store the field name and URL
                }
            }

            // Store the URLs in req so they can be accessed in subsequent handlers
            req.filesUploadedUrls = uploadedFiles;

            // Call the next middleware/route handler
            next();
            // res.status(201).json("done!")
            console.log("post created successfully!")

        });
    } catch (error) {
        next(error);
    }
};

// Helper function to upload a single file to Firebase Storage
const uploadFileToFirebase = async (file, userId) => {
    try {
        const firebaseFile = bucket.file(`images/${file.fieldname}/${userId}/${Date.now()}_${file.fieldname}${path.extname(file.originalname)}`);
        const stream = firebaseFile.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        return new Promise((resolve, reject) => {
            stream.on("error", (uploadError) => {
                console.error("Error uploading file to Firebase:", uploadError);
                reject(null);
            });

            stream.on("finish", async () => {
                try {
                    await firebaseFile.makePublic(); // Make the file publicly accessible
                    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(firebaseFile.name)}?alt=media`;
                    resolve(publicUrl); // Return the public URL of the uploaded file
                } catch (error) {
                    console.error("Error making file public:", error);
                    reject(null);
                }
            });

            stream.end(file.buffer); // End the stream and upload the file
        });
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

module.exports = uploadMultipleToFirebase;
