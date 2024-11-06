// Import the Firebase Admin SDK to access Firebase services
const admin = require('firebase-admin');

// Import the Firebase credentials
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
};

// Initialize the Firebase app using the credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

// Get a reference to the Firebase Storage bucket
const bucket = admin.storage().bucket();
// Export admin and bucket for use in other parts of the application
module.exports = { admin, bucket };