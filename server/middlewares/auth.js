// This file contains middleware functions for authentication and authorization in an Express.js application

// Import necessary libraries and models
import jwt from "jsonwebtoken"; // JSON Web Token is a library to create and verify tokens
import { User } from "../models/User.js"; // User model is used to get the user from the database

// Middleware to check if the user is authenticated (logged in)
export const isAuthenticated = async (req, res, next) => {
    // Get the token from cookies
    const { token } = req.cookies;

    // If token is not present, user is not logged in
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not logged in",
        });
    }
    // Try to verify the token
    try {
        // Decode the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user object to the request for use in next middleware/controllers
        req.user = await User.findById(decoded.id);
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        // If token is invalid or expired
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

// Middleware to check if the user has the required role to access a resource
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // If the user's role is not in the allowed roles, deny access
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user.role}) is not allowed to access this resource`,
            });
        }
        next(); // Continue to the next middleware or route handler
    };
};