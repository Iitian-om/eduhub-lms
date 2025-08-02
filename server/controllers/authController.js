// Description: Handles user authentication including registration, login, and logout functionalities.
import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

/* Registeration Algorithm:
        Validate the entries:
            1. Get user details from the request body which have form data attached to it 
            and profilePic from the request file (if uploaded)
            2. Check if the required fields are empty. if not pass
            3. Validate gender
            4. Check if a user with the same email or userName already exists, if not pass
        If NOT so create a new user in DB as:
            5. Hash the password for security
            6. Handle profilePic upload
            7. Capitalize first letter of gender
            8. Create the new user in the database
        Generate User Session:
            9. Generate a JWT token for the new user
            10. Set the token as a cookie and send the response
    */

export const register = async (req, res) => {
    // Perform Step 1:
    const { name, userName, email, password, gender } = req.body;

    // Perform Step 2:Validate required fields
    if (!name || !userName || !email || !password || !gender) {
        return res.status(400).json({
            success: false,
            message: "Please enter all * marked fields",
        });
    }

    // Perform Step 3: Validate gender
    if (!["male", "female", "Male", "Female"].includes(gender)) { // Determines whether an array includes a certain element, returning true or false as appropriate.
        return res.status(400).json({
            success: false,
            message: "Gender must be either 'Male' or 'Female'",
        });
    }

    // Start registering the user
    try {
        // Perform Step 4: Check if a user with the same email or userName already exists
        let existing_user = await User.findOne({ $or: [{ email }, { userName }] });
        if (existing_user) {
            return res.status(409).json({
                success: false,
                message: "A user with this email or username already exists",
            });
        }

        //Perform Step 5: Hash the password for security
        const salt = await bcrypt.genSalt(7); // Salt rounds can be adjusted for security vs performance
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using bcrypt

        // Perform Step 6: Handle profilePic upload to Cloudinary and store the URL in the database
        let profile_picture = ""; // Initialize profile_picture as an empty string
        if (req.file) // Check if a file was uploaded 
        {
            // Ensure Cloudinary is configured
            if (!cloudinary.v2.config().cloud_name) {
                return res.status(500).json({
                    success: false,
                    log: "Cloudinary configuration error",
                    message: "Cloudinary is not configured properly",
                });
            }
            // Use streamifier to convert buffer to stream
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

        // Perform Step 7: Capitalize first letter
        const normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

        // Perform Step 8: Create the new user in the database
        const user = await User.create({
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

        // Generate User Session:    
        // Perform Step 9: Generate a JWT token for the new user
        const token = generateToken(user);

        // Perform Step 10: Set the token as a cookie and send the response
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
            message: "Server Error while registering user",
            // Provide more details about the error
            log: error,
            error: error.message,
        });
    }
};

/* Login Algorithm:
        Validate the entries:
            1. Get email and password from the request body
            2. Check if both fields are provided, if not pass
        If so:
            3. Find the user by email and include the password field
            4. If user not found, return error
            5. Compare the provided password with the hashed password in the database
            6. If password doesn't match, return error
        Generate User Session:
            7. Generate a JWT token for the user
            8. Set the token as a cookie and send the response
*/

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
                secure: true, // Only send cookie over HTTPS in production
                sameSite: "none", // Fixing CORS issue by setting sameSite to none
            })
            .json({
                success: true,
                message: `Welcome back, ${user.name}`,
                user,
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error in setting cookie",
            error: error.message,
        });
    }
};

/* Logout Algorithm:
        1. Clear the cookie by setting it to an empty string and an expiration date in the past
        2. Send a success response
*/

export const logout = (req, res) => {
    // For a service, you might want to make these configurable via environment variables
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(0),
        sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "strict" : "lax"),
        secure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_DOMAIN || undefined, // For cross-subdomain support
        path: "/" // Ensure cookie is cleared from all paths
    };

    res.cookie("token", "", cookieOptions)
        .json({ 
            success: true, 
            message: "Logged out successfully" 
        });
}; 