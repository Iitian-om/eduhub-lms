import express from "express";
import { getAllCourses, createCourse } from "../controllers/courseController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllCourses);
router.post(
    "/",
    isAuthenticated,
    authorizeRoles("admin", "instructor"),
    createCourse
);

export default router; 