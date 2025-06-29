// This file is used to create the user model.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ // Schema is a blueprint for the structure of documents in a collection
    // This is the schema for the user model. 
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        trim: true, // Remove whitespace from both ends
        unique: true,
        required: true,
        lowercase: true, // Convert to lowercase for case-insensitive uniqueness
        minLength: [3, "Username must be at least 3 characters long"],
        maxLength: [15, "Username can't exceed 20 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Remove whitespace from both ends
    },
    password: {
        type: String,
        required: true,
        minLength: [7, "Password must be at least 6 characters long"],
        select: false, // Never return password by default in queries or responses by default
    },
    profile_picture: {
        type: String,
        default: "", // Cloudinary URL
    },
    role: {
        type: String,
        enum: ["User", "Admin", "Instructor"],
        default: "User", // Default role is User
    },
    created_At: {
        type: Date,
        default: Date.now,
    },
    // Array of course IDs the user is enrolled in
    Courses_Enrolled_In: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        default: [],
    },

    // Array of course IDs the user has created (for admin/instructor only)
    Courses_Created: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        default: [], // Can be empty if instructor has not created any courses. If user it wil be null array
    },
    
    // Gender: 'Male' or 'Female' (required)
    gender: {
        type: String,
        enum: ["Male", "Female", "Transgender", "Prefer not to say"],
        default: "Prefer not to say", // Default value if not specified
        required: true,
    },
    
    // User bio/intro (max 100 chars)
    bio: {
        type: String,
        maxlength: 100,
        default: "",
    },
});

export const User = mongoose.model("User", userSchema); 