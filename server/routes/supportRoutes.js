import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { chatbotRateLimit } from "../middlewares/chatbotRateLimit.js";
import { getSupportBotReply } from "../controllers/supportController.js";

const router = express.Router();

// Protect route, enforce role access, then apply per-user chatbot rate limiting.
router.post(
    "/chatbot",
    isAuthenticated,
    authorizeRoles("User", "Instructor", "Admin", "Mod"),
    chatbotRateLimit,
    getSupportBotReply
);

export default router;