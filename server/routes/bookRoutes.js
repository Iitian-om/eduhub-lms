import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createBook, getAllBooks, getBookById, updateBook, deleteBook, getUserBooks } from "../controllers/bookController.js";
import { uploadBook, handleFileUploadError } from "../middlewares/fileUpload.js";

// Book routes
const router = express.Router(); // Create a new router instance

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.get("/user/:userId", getUserBooks);

// Protected routes (require authentication)
router.post("/", isAuthenticated, uploadBook, handleFileUploadError, createBook);
router.put("/:id", isAuthenticated, updateBook);
router.delete("/:id", isAuthenticated, deleteBook);

// Export the router to be used in the main server file
export default router; 