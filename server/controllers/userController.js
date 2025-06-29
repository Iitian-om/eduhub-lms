/**
  Get user profile
  GET /api/v1/users/profile
 */

import multer from "multer"; // Multer config (in a separate file or here)
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/User.js";

const storage = multer.memoryStorage();  // Store files in memory as buffers
export const upload = multer({ storage });

export const getUserProfile = (req, res) => {
    // The user object is attached to the request in the isAuthenticated middleware.
    const user = req.user; // This is the user object that is attached to the request in the isAuthenticated middleware.

    res.status(200).json({
        success: true,
        user,
    });
};

// Controller function
export const uploadProfilePicture = async (req, res) => {
    try {
        // // Upload to Cloudinary
        // const result = await cloudinary.uploader.upload_stream(
        //     { folder: "eduhub/profiles" },

        //     async (error, result) => {

        //         if (error) return res.status(500).json({ error: error.message });
        //         // Update user with Cloudinary URL
        //         const user = await User.findByIdAndUpdate(
        //             req.user.id,
        //             { profile_picture: result.secure_url },
        //             { new: true }
        //         );
        //         res.json({ profile_picture: user.profile_picture });

        //     }
        // );
        // // Pipe file buffer to Cloudinary
        // req.file.stream.pipe(result);
        // req.file.path is the Cloudinary URL provided by multer-storage-cloudinary
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profile_picture: req.file.path },
            { new: true }
        );
        res.json({ profile_picture: user.profile_picture });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};