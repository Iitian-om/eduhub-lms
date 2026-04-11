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
const modAccess = [isAuthenticated, authorizeRoles("Admin", "Mod")];

router.get("/overview", ...modAccess, getModerationOverview);
router.get("/notes", ...modAccess, getModerationNotes);
router.get("/books", ...modAccess, getModerationBooks);
router.get("/papers", ...modAccess, getModerationPapers);

router.delete("/notes/:id", ...modAccess, deleteModerationNote);
router.delete("/books/:id", ...modAccess, deleteModerationBook);
router.delete("/papers/:id", ...modAccess, deleteModerationPaper);

export default router;