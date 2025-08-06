// adminController.js

// --- Local Module Imports ---
import { Book } from "../models/Book.js"; 
import { User } from "../models/User.js";
import { Note } from "../models/Note.js";
import { Course } from "../models/Course.js";
import { ResearchPaper } from "../models/ResearchPaper.js";

// --- User Management ---

// Get paginated, filtered list of users for admin panel
export const getUsers = async (req, res) => {
    // Parse query params for pagination and filtering
    const { page = 1, limit = 10, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
    ];
    const skip = (page - 1) * limit;
    // Fetch users from DB
    const users = await User.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ created_At: -1 });
    const total = await User.countDocuments(filter);
    res.json({
        users,
        totalPages: Math.ceil(total / limit),
        total
    });
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted" });
};

// --- Instructor Management ---

// Get all instructors
export const getInstructors = async (req, res) => {
    const instructors = await User.find({ role: "Instructor" });
    res.json({ instructors });
};

// Verify or unverify an instructor
export const verifyInstructor = async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    const instructor = await User.findByIdAndUpdate(id, { isVerified }, { new: true });
    res.json({ instructor });
};

// Update instructor details
export const updateInstructor = async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const instructor = await User.findByIdAndUpdate(id, update, { new: true });
    res.json({ instructor });
};

// Delete an instructor
export const deleteInstructor = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
};

// --- Course Management ---

// Get all courses with instructor info
export const getCourses = async (req, res) => {
    const courses = await Course.find().populate("createdBy", "name email");
    res.json({ courses });
};

// Update a course by ID
export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const course = await Course.findByIdAndUpdate(id, update, { new: true });
    res.json({ course });
};

// Delete a course by ID
export const deleteCourse = async (req, res) => {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ success: true });
};

// --- Content Management ---

// Get all notes
export const getNotes = async (req, res) => {
    const notes = await Note.find().populate("uploadedBy", "name email");
    res.json({ notes });
};
// Get all books
export const getBooks = async (req, res) => {
    const books = await Book.find().populate("uploadedBy", "name email");
    res.json({ books });
};
// Get all research papers
export const getPapers = async (req, res) => {
    const papers = await ResearchPaper.find().populate("uploadedBy", "name email");
    res.json({ papers });
};
// Delete a note by ID
export const deleteNote = async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};
// Delete a book by ID
export const deleteBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};
// Delete a research paper by ID
export const deletePaper = async (req, res) => {
    await ResearchPaper.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};

// --- Analytics, Reports, Audit Logs (Dummy Data) ---

// Get dashboard stats for admin
export const getStats = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalInstructors = await User.countDocuments({ role: "Instructor" });
    const totalContent = await Note.countDocuments() + await Book.countDocuments() + await ResearchPaper.countDocuments();
    const recentUsers = await User.find().sort({ created_At: -1 }).limit(5);
    const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5);
    res.json({ totalUsers, totalCourses, totalInstructors, totalContent, recentUsers, recentCourses });
};

// Analytics endpoint: returns real stats from DB
export const getAnalytics = async (req, res) => {
    try {
        // Get time range from query (default: last 30 days)
        const timeRange = parseInt(req.query.timeRange) || 30;
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - timeRange);

        // Real counts
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalMales = await User.countDocuments({ gender: "Male" });
        const totalFemales = await User.countDocuments({ gender: "Female" });
        const totalInstructors = await User.countDocuments({ role: "Instructor" });
        const totalContent =
            await Note.countDocuments() +
            await Book.countDocuments() +
            await ResearchPaper.countDocuments();

        // Monthly growth calculation (users created in last timeRange vs previous timeRange)
        const usersLastPeriod = await User.countDocuments({ created_At: { $gte: startDate, $lte: now } });
        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(startDate.getDate() - timeRange);
        const usersPrevPeriod = await User.countDocuments({ created_At: { $gte: prevStartDate, $lt: startDate } });
        const monthlyGrowth = usersPrevPeriod > 0
            ? Math.round(((usersLastPeriod - usersPrevPeriod) / usersPrevPeriod) * 100)
            : 0;

        // Top courses by enrolled students
        const topCourses = await Course.find()
            .sort({ "enrolledStudents.length": -1 })
            .limit(5)
            .populate("createdBy", "name email");

        // Top instructors by courses created
        const topInstructors = await User.find({ role: "Instructor" })
            .sort({ "Courses_Created.length": -1 })
            .limit(5);

        // Revenue: If you have a payments collection, aggregate here. Otherwise, set to zero.
        const totalRevenue = 0; // Replace with aggregation if you have payments

        // Course stats by category
        const courseStats = await Course.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]).then(stats => stats.map(s => ({ category: s._id, count: s.count })));

        res.json({
            overview: {
                totalUsers,
                totalCourses,
                totalContent,
                totalInstructors,
                totalRevenue,
                monthlyGrowth
            },
            userGrowth: [], // Fill with real user growth data if needed
            courseStats,
            contentStats: [], // Fill with real content stats if needed
            revenueData: [], // Fill with real revenue data if needed
            topCourses,
            topInstructors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
};

// Get reports (dummy data)
export const getReports = async (req, res) => {
    // Return dummy reports data
    res.json({
        overview: {
            totalRevenue: 5000,
            totalEnrollments: 1200,
            activeUsers: 800,
            courseCompletionRate: 75
        },
        revenue: { monthly: [], topCourses: [], topInstructors: [] },
        users: { growth: [], demographics: [], activity: [] },
        courses: { performance: [], categories: [], completion: [] }
    });
};

// Get audit logs (dummy data)
export const getAuditLogs = async (req, res) => {
    // Return dummy logs
    res.json({
        logs: [],
        totalPages: 1
    });
};

// --- Notifications (Dummy CRUD) ---

// In-memory notifications array for demo
let notifications = [];
// Get all notifications
export const getNotifications = (req, res) => {
    res.json({ notifications });
};
// Create a new notification
export const createNotification = (req, res) => {
    const notif = { ...req.body, _id: Date.now().toString(), createdAt: new Date() };
    notifications.push(notif);
    res.json({ notification: notif });
};
// Update a notification by ID
export const updateNotification = (req, res) => {
    const idx = notifications.findIndex(n => n._id === req.params.id);
    if (idx !== -1) notifications[idx] = { ...notifications[idx], ...req.body };
    res.json({ notification: notifications[idx] });
};
// Delete a notification by ID
export const deleteNotification = (req, res) => {
    notifications = notifications.filter(n => n._id !== req.params.id);
    res.json({ success: true });
};
// Toggle notification active status
export const toggleNotification = (req, res) => {
    const idx = notifications.findIndex(n => n._id === req.params.id);
    if (idx !== -1) notifications[idx].isActive = req.body.isActive;
    res.json({ notification: notifications[idx] });
};

// --- Platform Settings (Dummy) ---

// In-memory settings object for demo
let settings = {
    general: { siteName: "EduHub LMS", siteDescription: "...", contactEmail: "...", supportPhone: "...", timezone: "UTC", dateFormat: "MM/DD/YYYY", timeFormat: "12h" },
    security: { passwordMinLength: 8, requireEmailVerification: true, allowSocialLogin: true, sessionTimeout: 24, maxLoginAttempts: 5, enableTwoFactor: false },
    notifications: { emailNotifications: true, pushNotifications: true, courseUpdates: true, systemMaintenance: true, marketingEmails: false },
    payment: { currency: "USD", stripeEnabled: true, paypalEnabled: false, taxRate: 0.08, refundPolicy: "7 days", autoRenewal: true },
    content: { maxFileSize: 50, allowedFileTypes: ["pdf", "doc", "docx", "mp4", "jpg", "png"], autoApproveCourses: false, contentModeration: true, plagiarismCheck: true }
};
// Get all platform settings
export const getSettings = (req, res) => {
    res.json(settings);
};
// Update a settings tab
export const updateSettings = (req, res) => {
    const tab = req.params.tab;
    settings[tab] = req.body;
    res.json({ success: true, settings });
};
