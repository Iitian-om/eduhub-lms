import express from "express";
import { getRoot, getAbout } from "../controllers/otherController.js";

const router = express.Router();

router.get("/", getRoot);
router.get("/about", getAbout);
// router.get("/contact", getContact);
// router.get("/privacy", getPrivacy);
// router.get("/terms", getTerms);

export default router; 