// This file is used to create the user model.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ // Schema is a blueprint for the structure of documents in a collection
    // This is the schema for the user model. 
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [7, "Password must be at least 6 characters long"],
        select: false, // Do not send password in response
    },
    role: {
        type: String,
        enum: ["user", "admin", "instructor"],
        default: "user", // Default role is user
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model("User", userSchema); 