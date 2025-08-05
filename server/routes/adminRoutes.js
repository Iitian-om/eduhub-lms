import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import * as admin from "../controllers/adminController.js";

const router = express.Router();
const adminOnly = [isAuthenticated, authorizeRoles("Admin")];

// User management
router.get("/users", ...adminOnly, admin.getUsers);
router.delete("/users/:id", ...adminOnly, admin.deleteUser);

// Instructor management
router.get("/instructors", ...adminOnly, admin.getInstructors);
router.patch("/instructors/:id/verify", ...adminOnly, admin.verifyInstructor);
router.put("/instructors/:id", ...adminOnly, admin.updateInstructor);
router.delete("/instructors/:id", ...adminOnly, admin.deleteInstructor);

// Course management
router.get("/courses", ...adminOnly, admin.getCourses);
router.put("/courses/:id", ...adminOnly, admin.updateCourse);
router.delete("/courses/:id", ...adminOnly, admin.deleteCourse);

// Content management
router.get("/notes", ...adminOnly, admin.getNotes);
router.get("/books", ...adminOnly, admin.getBooks);
router.get("/papers", ...adminOnly, admin.getPapers);
router.delete("/notes/:id", ...adminOnly, admin.deleteNote);
router.delete("/books/:id", ...adminOnly, admin.deleteBook);
router.delete("/papers/:id", ...adminOnly, admin.deletePaper);

// Analytics, stats, reports, audit logs
router.get("/stats", ...adminOnly, admin.getStats);
router.get("/analytics", ...adminOnly, admin.getAnalytics);
router.get("/reports", ...adminOnly, admin.getReports);
router.get("/audit-logs", ...adminOnly, admin.getAuditLogs);

// Notifications
router.get("/notifications", ...adminOnly, admin.getNotifications);
router.post("/notifications", ...adminOnly, admin.createNotification);
router.put("/notifications/:id", ...adminOnly, admin.updateNotification);
router.delete("/notifications/:id", ...adminOnly, admin.deleteNotification);
router.patch("/notifications/:id/toggle", ...adminOnly, admin.toggleNotification);

// Platform settings
router.get("/settings", ...adminOnly, admin.getSettings);
router.put("/settings/:tab", ...adminOnly, admin.updateSettings);

export default router;
