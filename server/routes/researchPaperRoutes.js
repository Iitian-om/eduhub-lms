import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { 
    createResearchPaper, 
    getAllResearchPapers, 
    getResearchPaperById, 
    updateResearchPaper, 
    deleteResearchPaper, 
    getUserResearchPapers,
    incrementCitations
} from "../controllers/researchPaperController.js";
import { uploadResearchPaper, handleFileUploadError } from "../middlewares/fileUpload.js";

const router = express.Router();

// Public routes
router.get("/", getAllResearchPapers);
router.get("/:id", getResearchPaperById);
router.get("/user/:userId", getUserResearchPapers);
router.put("/:id/citations", incrementCitations);

// Protected routes (require authentication)
router.post("/", isAuthenticated, uploadResearchPaper, handleFileUploadError, createResearchPaper);
router.put("/:id", isAuthenticated, updateResearchPaper);
router.delete("/:id", isAuthenticated, deleteResearchPaper);

export default router; 