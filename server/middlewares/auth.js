import jwt from "jsonwebtoken"; // JSON Web Token is a library to create and verify tokens
import { User } from "../models/User.js"; // User model is used to get the user from the database

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies; // Destructuring the token from the cookies

    if (!token) { // If the token is not present, return a 401 status code and a message
        return res.status(401).json({
            success: false,
            message: "Not logged in",
        });
    }
    // Verify the token using jwt.verify method
    // The jwt.verify method takes the token and the secret key to verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Currently we don't have a secret key in environment variables
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

// This middleware function checks if the user has the required role to access a resource
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user.role}) is not allowed to access this resource`,
            });
        }
        next();
    };
}; 