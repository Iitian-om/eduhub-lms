// Description: Handles user authentication including registration, login, and logout functionalities.
import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// Register a new user
export const register = async (req, res) => {
    // Get user details from the request body which have form data attached to it
    // and profilePic from the request file (if uploaded)
    const { name, userName, email, password, gender } = req.body;

    // Validate required fields
    if (!name || !userName || !email || !password || !gender) {
        return res.status(400).json({
            success: false,
            message: "Please enter all * marked fields",
        });
    }
    // Validate gender
    if (!["male", "female", "Male", "Female"].includes(gender)) {
        return res.status(400).json({
            success: false,
            message: "Gender must be either 'Male' or 'Female'",
        });
    }

    try {
        // Check if a user with the same email or userName already exists
        let user = await User.findOne({ $or: [{ email }, { userName }] });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User with this email or username already exists",
            });
        }
        
        // Hash the password for security
        const salt = await bcrypt.genSalt(7); // Salt rounds can be adjusted for security vs performance
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using bcrypt
        
        // Handle profilePic upload
        let profile_picture = "";
        if (req.file) {
            // Upload buffer to Cloudinary
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.v2.uploader.upload_stream(
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
            profile_picture = result.secure_url; // Use Cloudinary URL directly
        }

        // Capitalize first letter
        const normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

        // Create the new user in the database
        user = await User.create({
            name,
            userName,
            email,
            gender: normalizedGender,
            profile_picture,
            password: hashedPassword,
            Courses_Enrolled_In: [],
            Courses_Created: [],
            // role and createdAt will use defaults
        });

        // Generate a JWT token for the new user
        const token = generateToken(user);
        
        // Set the token as a cookie and send the response
        res.status(201)
            .cookie("token", token, {
                httpOnly: true, // Cookie can't be accessed by JS on the client
                secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Lax for dev, strict for prod
            })
            .json({
                success: true,
                message: "User registered successfully",
                user,
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Login an existing user
export const login = async (req, res) => {
    // Get email and password from the request body
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields",
        });
    }

    try {
        // Find the user by email and include the password field
        const user = await User.findOne({ email }).select("+password");

        // If user not found, return error
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match, return error
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate a JWT token for the user
        const token = generateToken(user);
        const isProduction = process.env.NODE_ENV === "production";

        // Set the token as a cookie and send the response
        res.status(200)
            .cookie("token", token, {
                httpOnly: true, // Cookie can't be accessed by JS on the client
                secure: isProduction, // Only send cookie over HTTPS in production
                sameSite: isProduction ? "strict" : "lax", // Lax for dev, strict for prod
            })
            .json({
                success: true,
                message: `Welcome back, ${user.name}`,
                user,
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Logout user (clear the cookie)
export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
    }).json({ success: true, message: "Logged out successfully" });
};