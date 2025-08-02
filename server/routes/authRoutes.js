// This file defines the routes for user authentication in the application.
import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import upload from "../middlewares/upload.js";

// Create a new router instance
const router = express.Router();

// Define the routes for user authentication
router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.post("/logout", logout);

export default router;