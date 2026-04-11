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

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toPublicProfile = (user) => ({
    _id: user._id,
    name: user.name,
    userName: user.userName,
    role: user.role,
    bio: user.bio || "",
    location: user.location || "",
    profile_picture: user.profile_picture || "",
    created_At: user.created_At,
    stats: {
        enrolledCourses: Array.isArray(user.Courses_Enrolled_In) ? user.Courses_Enrolled_In.length : 0,
        completedCourses: Array.isArray(user.Courses_Completed) ? user.Courses_Completed.length : 0,
        createdCourses: Array.isArray(user.Courses_Created) ? user.Courses_Created.length : 0,
    },
});

export const getPublicProfiles = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
        const role = req.query.role;
        const search = (req.query.search || "").toString().trim().slice(0, 60);

        const filter = { _id: { $ne: req.user._id } };

        if (role && ["User", "Instructor", "Admin", "Mod"].includes(role)) {
            filter.role = role;
        }

        if (search) {
            const safeSearch = escapeRegex(search);
            filter.$or = [
                { name: { $regex: safeSearch, $options: "i" } },
                { userName: { $regex: safeSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("name userName role bio location profile_picture created_At Courses_Enrolled_In Courses_Completed Courses_Created")
                .sort({ created_At: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            users: users.map(toPublicProfile),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch public profiles",
            error: error.message,
        });
    }
};

export const getPublicProfileByUsername = async (req, res) => {
    try {
        const userName = (req.params.userName || "").toString().trim().toLowerCase();

        if (!userName) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        const user = await User.findOne({ userName })
            .select("name userName role bio location profile_picture created_At Courses_Enrolled_In Courses_Completed Courses_Created");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({
            success: true,
            user: toPublicProfile(user),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};