// File: server/middleware/upload.js
// Uses Multer with Cloudinary for profile image uploads

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
// This middleware handles file uploads for user profile pictures using Multer and Cloudinary.