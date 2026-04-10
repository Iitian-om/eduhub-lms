import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  getPublicProfiles,
  getPublicProfileByUsername,
} from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.post("/profile/upload", isAuthenticated, upload.single("profile_picture"), uploadProfilePicture);
router.get("/profiles", isAuthenticated, getPublicProfiles);
router.get("/profiles/:userName", isAuthenticated, getPublicProfileByUsername);

export default router;