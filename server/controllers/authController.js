// Description: Handles user authentication including registration, login, and logout functionalities.
import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

// Register a new user
export const register = async (req, res) => {
    // Get user details from the request body
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields",
        });
    }

    try {
        // Check if a user with the same email already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user in the database
        user = await User.create({
            name,
            email,
            password: hashedPassword,
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