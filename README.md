# Social Media App (Backend)

A backend project consisting of REST APIs for a social media application built with **Node.js**, **Express.js**, **MongoDB**, and **Firebase Storage**. The app supports core features like user authentication, posting, commenting, messaging, and image uploads.

## Key Features

- **Authentication** (JWT-based login and registration)
- **CRUD operations** for users, posts, comments, and stories
- **File storage** for media (posts, stories images) using Firebase Storage
- **Like, dislike, follow, block, and messaging functionality**
- **Commenting and replying** on posts with likes and dislikes on comments and replies

## API Endpoints

A full list of API routes is included in the `api` directory of the project. Key routes include:

```
social-media-app
├── auth
│   └── POST /auth/register - Register a new user
│   └── POST /auth/login - Login user
...
├── user
│   └── GET /user/{userId} - Get user details
...
├── post
│   └── POST /post/create - Create a new post
...
├── comment
│   └── POST /comment/create - Create a comment on a post
...
```

## How to Run This Project

Follow these steps to clone, set up, and run the backend on your local machine:

1. **Clone the repo**:
   ```bash
   [git clone https://github.com/alamrehan1234/social-media-app_backend
   cd social-media-app
   ```

2. **Set up Node.js**: Make sure you have Node.js installed. If not, download it from [Node.js](https://nodejs.org/).

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up MongoDB**:
   - Create a MongoDB Atlas account.
   - Set up your cluster and get the MongoDB URI.

5. **Set up Firebase**:
   - Create a Firebase project.
   - Set up Firebase Storage and get your Firebase credentials.

6. **Create a `.env` file**:
   Create a `.env` file in the root directory with the following environment variables:
   ```
   MONGO_URL=<Your MongoDB URI>
   FIREBASE_PRIVATE_KEY=<Your Firebase private key>
   FIREBASE_CLIENT_EMAIL=<Your Firebase client email>
   FIREBASE_PROJECT_ID=<Your Firebase project ID>
   SECRET_KEY_JWT=<Your JWT secret key>
   ```

7. **Run the app**:
   ```bash
   npm start
   ```

8. **Test the endpoints**:
   Use Postman or any other API testing tool to test the API endpoints. Refer to the route descriptions for detailed usage.

## Important Note

**DO NOT** use the cloned `node_modules` folder. Delete it after cloning the repository and run `npm install` to get the necessary dependencies for your system.

