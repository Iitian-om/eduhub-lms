import express from "express";
import { getAllCourses, createCourse, getCourseById, enrollInCourse, getEnrolledCourses } from "../controllers/courseController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/enrolled/courses", isAuthenticated, getEnrolledCourses);
router.post("/enroll", isAuthenticated, enrollInCourse);
router.post(
    "/",
    isAuthenticated,
    authorizeRoles("admin", "instructor"),
    createCourse
);

export default router; 