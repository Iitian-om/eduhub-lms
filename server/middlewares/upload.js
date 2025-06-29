// // File: server/middlewares/upload.js  is our Multer middleware
// // This file is responsible for handling file uploads in the application, specifically for user profile pictures.

// import path from "path"; // Node.js path module to handle file paths
// import fs from "fs"; // Node.js file system module to check and create directories
// import multer from "multer"; // Multer is a middleware for handling multipart/form-data, which is used for uploading files in Node.js applications

// // Ensure the uploads/profilePics directory exists
// const uploadDir = path.join(process.cwd(), "uploads", "profilePics");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist, including parent directories
//   console.log(`Upload directory created at: ${uploadDir}`); // Comment-out in production launch
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedTypes.test(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed!"));
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
//   fileFilter,
// });

// export default upload; 




// File: server/middleware/upload.js
// Uses Multer with Cloudinary for profile image uploads

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Configure CloudinaryStorage for profile pics
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "eduhub/profilePics",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
    public_id: (req, file) => {
      // Optionally, use the username or email in the filename for uniqueness
      return `${Date.now()}-${file.originalname.split(".")[0]}`;
    }
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = file.mimetype.split("/")[1];
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

export default upload;
// This middleware handles file uploads for user profile pictures using Multer and Cloudinary.