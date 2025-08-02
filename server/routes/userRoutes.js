import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getUserProfile, updateProfile, uploadProfilePicture } from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.post("/profile/upload", isAuthenticated, upload.single("profile_picture"), uploadProfilePicture);

export default router;