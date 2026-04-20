/**
 * User controller module for profile management in the EduHub LMS backend.
 *
 * This file defines Express controllers and upload middleware for authenticated user features:
 * - Fetching the current user's profile (`getUserProfile`).
 * - Updating profile details such as name, bio, phone, location, and gender (`updateProfile`),
 *   including required-field checks and username uniqueness validation.
 * - Uploading and updating a profile picture (`uploadProfilePicture`) using Multer memory storage,
 *   Streamifier, and Cloudinary streaming upload.
 * - Fetching paginated public user profiles with optional role and search filters (`getPublicProfiles`).
 * - Fetching a single public profile by username (`getPublicProfileByUsername`).
 *
 * It also includes small internal helpers to:
 * - Safely escape regex input for search queries.
 * - Normalize user documents into a public-profile response shape with basic course-related stats.
 */

import multer from "multer"; // Multer config (in a separate file or here)
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/User.js";
import streamifier from "streamifier";

const storage = multer.memoryStorage();  // Store files in memory as buffers
export const upload = multer({ storage });

// Controller function for fetching the current authenticated (or loggrd in) user's profile
export const getUserProfile = (req, res) => {
    // The user object is attached to the request in the isAuthenticated middleware.
    const user = req.user; // This is the user object that is attached to the request in the isAuthenticated middleware.

    res.status(200).json({
        success: true,
        user,
    });
};

// Here i Define two Controllers for profie update and profile picture update 

// TODO: REMOVE userName FROM THIS LIST BECAUSE IT WILL NOT BE UPDATED FURTHER IN THE FUTURE  

// 1st PU controller: Update user profile (without profile picture)
export const updateProfile = async (req, res) => {
    try {
        const { name, userName, bio, phone, location, gender } = req.body;

        // // Validate required fields
        // if (!name || !userName) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Name and username are required",
        //     });
        // }

        // // Check if username is already taken by another user
        // const existingUser = await User.findOne({ 
        //     userName: userName.toLowerCase(),
        //     _id: { $ne: req.user._id } // Exclude current user
        // });
        
        // if (existingUser) {
        //     return res.status(409).json({
        //         success: false,
        //         message: "Username is already taken",
        //     });
        // }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name.trim(),
                // userName: userName.toLowerCase().trim(),
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
        console.log("A User's Profile updated successfully:", updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

// 2nd PU controller: Controller function for Profile Picture Uploads
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
                message: "Cloudinary Agent is not configured properly or Temeporary Down"
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

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");       // utility function to escape special characters in regex for safe search queries

// Convert user document to public profile format
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

// Controller function for fetching public profiles
export const getPublicProfiles = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
        const role = req.query.role;
        const search = (req.query.search || "").toString().trim().slice(0, 60);

        // Build the filter object for MongoDB query
        const filter = { _id: { $ne: req.user._id } };

        // If role filter is provided and valid, add it to the filter
        if (role && ["User", "Instructor", "Admin", "Mod"].includes(role)) {
            filter.role = role;
        }

        // If search query is provided, add case-insensitive regex filter for name and username
        if (search) {
            const safeSearch = escapeRegex(search);
            filter.$or = [
                { name: { $regex: safeSearch, $options: "i" } },
                { userName: { $regex: safeSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;    // Calculate how many documents to skip for pagination

        // Execute both queries in parallel: one for fetching users and another for counting total matching documents
        const [users, total] = await Promise.all([
            User.find(filter)
                .select("name userName role bio location profile_picture created_At Courses_Enrolled_In Courses_Completed Courses_Created")
                .sort({ created_At: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        // Map users to public profile format and send response with pagination info
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

// Express Constant Controller function for fetching a public profile by username
export const getPublicProfileByUsername = async (req, res) => {
    try {
        const userName = (req.params.userName || "").toString().trim().toLowerCase();

        if (!userName) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        // Find the user by username and select only public fields
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