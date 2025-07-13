import express from "express";

import { getAllCourses, 
        createCourse, 
        getCourseById, 
        enrollInCourse, 
        getEnrolledCourses, 
        checkEnrollment, 
        markLessonComplete, 
        getCourseProgress,
        markCourseComplete } 
    from "../controllers/courseController.js";

import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/enrolled/courses", isAuthenticated, getEnrolledCourses);
router.post("/enroll", isAuthenticated, enrollInCourse);
router.get("/check-enrollment/:courseId", isAuthenticated, checkEnrollment);
router.get("/progress/:courseId", isAuthenticated, getCourseProgress);
router.post("/lesson/complete", isAuthenticated, markLessonComplete);
router.post("/complete/:courseId", isAuthenticated, markCourseComplete);
router.get("/:id", getCourseById);
router.post(
    "/",
    isAuthenticated,
    authorizeRoles("Admin", "Instructor"),
    createCourse
);

export default router; 