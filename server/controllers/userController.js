/**
  Get user profile
  GET /api/v1/users/profile
 */

import multer from "multer"; // Multer config (in a separate file or here)
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/User.js";
import streamifier from "streamifier";

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

// Update user profile (without profile picture)
export const updateProfile = async (req, res) => {
    try {
        const { name, userName, bio, phone, location, gender } = req.body;

        // Validate required fields
        if (!name || !userName) {
            return res.status(400).json({
                success: false,
                message: "Name and username are required",
            });
        }

        // Check if username is already taken by another user
        const existingUser = await User.findOne({ 
            userName: userName.toLowerCase(),
            _id: { $ne: req.user._id } // Exclude current user
        });
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username is already taken",
            });
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name.trim(),
                userName: userName.toLowerCase().trim(),
                bio: bio?.trim() || "",
                phone: phone?.trim() || "",
                location: location?.trim() || "",
                gender: gender || req.user.gender,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

// Controller function
export const uploadProfilePicture = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No profile picture uploaded"
            });
        }

        // Ensure Cloudinary is configured
        if (!cloudinary.config().cloud_name) {
            return res.status(500).json({
                success: false,
                message: "Cloudinary is not configured properly"
            });
        }

        // Upload buffer to Cloudinary using streamifier
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "eduhub/profilePics" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);
        const profile_picture = result.secure_url;

        // Update user with new profile picture URL
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profile_picture },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profile_picture: user.profile_picture,
            user
        });
    } catch (error) {
        console.error("Profile picture upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload profile picture",
            error: error.message
        });
    }
};