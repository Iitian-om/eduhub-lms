import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import {
    getModerationOverview,
    getModerationNotes,
    getModerationBooks,
    getModerationPapers,
    deleteModerationNote,
    deleteModerationBook,
    deleteModerationPaper,
} from "../controllers/modController.js";

const router = express.Router();
const adminOnly = [isAuthenticated, authorizeRoles("Admin")];
const modAccess = [isAuthenticated, authorizeRoles("Admin", "Mod")];

router.get("/overview", ...modAccess, getModerationOverview);
router.get("/notes", ...modAccess, getModerationNotes);
router.get("/books", ...modAccess, getModerationBooks);
router.get("/papers", ...modAccess, getModerationPapers);

router.delete("/notes/:id", ...adminOnly, deleteModerationNote);
router.delete("/books/:id", ...adminOnly, deleteModerationBook);
router.delete("/papers/:id", ...adminOnly, deleteModerationPaper);

export default router;