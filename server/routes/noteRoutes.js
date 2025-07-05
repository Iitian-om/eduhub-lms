import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { 
    createNote, 
    getAllNotes, 
    getNoteById, 
    updateNote, 
    deleteNote, 
    getUserNotes,
    getNotesByCourse
} from "../controllers/noteController.js";
import { uploadNote, handleFileUploadError } from "../middlewares/fileUpload.js";

const router = express.Router();

// Public routes
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.get("/user/:userId", getUserNotes);
router.get("/course/:courseId", getNotesByCourse);

// Protected routes (require authentication)
router.post("/", isAuthenticated, uploadNote, handleFileUploadError, createNote);
router.put("/:id", isAuthenticated, updateNote);
router.delete("/:id", isAuthenticated, deleteNote);

export default router; 