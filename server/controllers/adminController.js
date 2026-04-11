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
    const recentUsers = await User.find()
        .sort({ created_At: -1 })
        .limit(10)
        .select("_id name email role created_At")
        .lean();
    const recentCourses = await Course.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("_id title category createdAt")
        .lean(); 
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
                totalMales,
                totalFemales,
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

// Get audit logs (Real Logs Data from Vercel + Render)

const AUDIT_LEVELS = new Set(["error", "warning", "info", "success"]); // Supported normalized levels used by the admin UI badges and filters.

// Normalize provider-specific severities into UI-safe levels.
const normalizeLevel = (rawLevel = "", message = "", statusCode = "") => {
    const level = String(rawLevel || "").toLowerCase();
    if (AUDIT_LEVELS.has(level)) return level;

    const msg = String(message || "").toLowerCase();
    const status = Number(statusCode);

    if (level === "warn") return "warning";
    if (status >= 500 || msg.includes("error") || msg.includes("exception") || msg.includes("failed")) return "error";
    if ((status >= 400 && status < 500) || msg.includes("warn")) return "warning";
    if (status >= 200 && status < 400) return "success";
    return "info";
};

// Best-effort action detection from log text for action-based filtering.
const detectAction = (message = "") => {
    const msg = String(message || "").toLowerCase();
    if (msg.includes("login") || msg.includes("sign in")) return "login";
    if (msg.includes("logout") || msg.includes("sign out")) return "logout";
    if (msg.includes("create") || msg.includes("created")) return "create";
    if (msg.includes("update") || msg.includes("updated") || msg.includes("edit")) return "update";
    if (msg.includes("delete") || msg.includes("removed")) return "delete";
    if (msg.includes("enroll")) return "enroll";
    if (msg.includes("payment") || msg.includes("checkout")) return "payment";
    return "system";
};

// Render logs include metadata in label pairs; this helper extracts one value.
const getLabelValue = (labels = [], key) => {
    const label = labels.find((item) => item?.name === key);
    return label?.value;
};

// Simple regex to match IPv4 addresses in various log fields and formats.
const IPV4_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;

const firstIpFromString = (value = "") => {
    const text = String(value || "");
    const match = text.match(IPV4_REGEX);
    return match ? match[0] : "";
};

const resolveIpAddress = (...candidates) => {
    for (const candidate of candidates) {
        if (!candidate) continue;

        if (Array.isArray(candidate)) {
            const resolved = resolveIpAddress(...candidate);
            if (resolved) return resolved;
            continue;
        }

        if (typeof candidate === "object") {
            const resolved = resolveIpAddress(...Object.values(candidate));
            if (resolved) return resolved;
            continue;
        }

        const raw = String(candidate).trim();
        if (!raw) continue;

        // x-forwarded-for style values may contain multiple comma-separated IPs.
        const firstSegment = raw.split(",")[0].trim();
        const ip = firstIpFromString(firstSegment) || firstIpFromString(raw);
        if (ip) return ip;
    }

    return "";
};

// Parse pagination inputs safely and fallback on invalid values.
const toPositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// Fetch frontend runtime logs from Vercel and convert them to a shared shape.
const fetchVercelLogs = async ({ search = "", limit = 50, levelFilter = "" }) => {
    const token = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    if (!token || !projectId) {
        return {
            logs: [],
            connected: false,
            error: "Missing VERCEL_TOKEN or VERCEL_PROJECT_ID"
        };
    }

    const endpoint = process.env.VERCEL_LOGS_API_URL || `https://api.vercel.com/v2/projects/${projectId}/logs`;
    const params = new URLSearchParams({
        limit: String(Math.min(limit, 100)),
        since: String(Date.now() - 60 * 60 * 1000)
    });

    if (teamId) params.set("teamId", teamId);
    if (search) params.set("query", search);
    if (levelFilter) params.set("level", levelFilter);

    const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        return {
            logs: [],
            connected: false,
            error: `Vercel API failed (${response.status}): ${errorText.slice(0, 200)}`
        };
    }

    const payload = await response.json();
    const rawLogs = Array.isArray(payload) ? payload : (payload?.logs || []);

    const logs = rawLogs.map((log, index) => {
        const statusCode = log?.statusCode || log?.status || "";
        const message =
            log?.message ||
            log?.text ||
            log?.requestPath ||
            log?.path ||
            "Frontend runtime log";
        const timestamp = log?.timestamp || log?.createdAt || log?.time || new Date().toISOString();
        const level = normalizeLevel(log?.level, message, statusCode);
        const ipAddress = resolveIpAddress(
            log?.ipAddress,
            log?.ip,
            log?.requestIp,
            log?.clientIp,
            log?.sourceIp,
            log?.request?.ip,
            log?.request?.headers?.["x-forwarded-for"],
            log?.headers?.["x-forwarded-for"],
            log?.metadata,
            message
        ) || "N/A";

        // Return a normalized audit log compatible with existing frontend table fields.
        return {
            _id: `vercel-${log?.id || index}-${new Date(timestamp).getTime()}`,
            source: "frontend",
            platform: "vercel",
            level,
            action: detectAction(message),
            description: message,
            ipAddress,
            timestamp,
            user: {
                name: "Frontend (Vercel)",
                email: "frontend@eduhub-lms-rose.vercel.app"
            }
        };
    });

    return {
        logs,
        connected: true,
        error: null
    };
};

// Fetch backend service logs from Render and convert them to the same shared shape.
const fetchRenderLogs = async ({ search = "", limit = 50, levelFilter = "" }) => {
    const token = process.env.RENDER_API_KEY;
    const ownerId = process.env.RENDER_OWNER_ID;
    const resourceIds = (process.env.RENDER_RESOURCE_IDS || process.env.RENDER_SERVICE_ID || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    if (!token || !ownerId || resourceIds.length === 0) {
        return {
            logs: [],
            connected: false,
            error: "Missing RENDER_API_KEY, RENDER_OWNER_ID, or RENDER_RESOURCE_IDS"
        };
    }

    const endpoint = process.env.RENDER_LOGS_API_URL || "https://api.render.com/v1/logs";
    const params = new URLSearchParams({
        ownerId,
        direction: "backward",
        limit: String(Math.min(limit, 100))
    });

    resourceIds.forEach((id) => params.append("resource", id));
    if (search) params.append("text", search);
    if (levelFilter) params.append("level", levelFilter);

    const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        return {
            logs: [],
            connected: false,
            error: `Render API failed (${response.status}): ${errorText.slice(0, 200)}`
        };
    }

    const payload = await response.json();
    const rawLogs = Array.isArray(payload?.logs) ? payload.logs : [];

    const logs = rawLogs.map((log, index) => {
        const statusCode = getLabelValue(log?.labels, "statusCode") || "";
        const method = getLabelValue(log?.labels, "method") || "";
        const path = getLabelValue(log?.labels, "path") || "";
        const host = getLabelValue(log?.labels, "host") || "";
        const level = normalizeLevel(getLabelValue(log?.labels, "level"), log?.message, statusCode);
        const description = [method, path, log?.message].filter(Boolean).join(" ").trim() || "Backend service log";
        const ipAddress = resolveIpAddress(
            getLabelValue(log?.labels, "ip"),
            getLabelValue(log?.labels, "remoteAddr"),
            getLabelValue(log?.labels, "remote_addr"),
            getLabelValue(log?.labels, "clientIp"),
            getLabelValue(log?.labels, "xForwardedFor"),
            getLabelValue(log?.labels, "x_forwarded_for"),
            getLabelValue(log?.labels, "forwarded"),
            host,
            description
        ) || host || "N/A";

        // Keep backend entries consistent with frontend entries for easy merging and filtering.
        return {
            _id: `render-${log?.id || index}-${new Date(log?.timestamp || Date.now()).getTime()}`,
            source: "backend",
            platform: "render",
            level,
            action: detectAction(description),
            description,
            ipAddress,
            timestamp: log?.timestamp || new Date().toISOString(),
            user: {
                name: "Backend (Render)",
                email: "backend@eduhub-crit.onrender.com"
            }
        };
    });

    return {
        logs,
        connected: true,
        error: null
    };
};

// Local fallback for development: infer audit-like entries from recent DB changes.
const fetchLocalAuditLogs = async ({ limit = 100 }) => {
    const [recentUsers, recentCourses] = await Promise.all([
        User.find()
            .sort({ created_At: -1 })
            .limit(limit)
            .select("_id name email created_At")
            .lean(),
        Course.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("_id title category createdAt")
            .lean()
    ]);

    const userLogs = recentUsers.map((user) => ({
        _id: `local-user-${user._id}`,
        source: "local",
        platform: "mongodb",
        level: "success",
        action: "create",
        description: `New user registered: ${user.name || "Unknown user"}`,
        ipAddress: "127.0.0.1",
        timestamp: user.created_At || new Date().toISOString(),
        user: {
            name: user.name || "User",
            email: user.email || "N/A"
        }
    }));

    const courseLogs = recentCourses.map((course) => ({
        _id: `local-course-${course._id}`,
        source: "local",
        platform: "mongodb",
        level: "info",
        action: "create",
        description: `Course created: ${course.title || "Untitled course"}`,
        ipAddress: "127.0.0.1",
        timestamp: course.createdAt || new Date().toISOString(),
        user: {
            name: "System",
            email: "system@localhost"
        }
    }));

    return {
        logs: [...userLogs, ...courseLogs],
        connected: true,
        error: null
    };
};

// Get audit logs from Vercel (frontend) + Render (backend)
export const getAuditLogs = async (req, res) => {
    try {
        // Read and sanitize filter + pagination params from query string.
        const page = toPositiveInt(req.query.page, 1);
        const limit = Math.min(toPositiveInt(req.query.limit, 20), 100);
        const level = String(req.query.level || "").toLowerCase();
        const action = String(req.query.action || "").toLowerCase();
        const search = String(req.query.search || "").trim().toLowerCase();

        // Fetch both providers in parallel to reduce overall response latency.
        const [vercelResult, renderResult, localResult] = await Promise.all([
            fetchVercelLogs({ search, limit: 100, levelFilter: level }),
            fetchRenderLogs({ search, limit: 100, levelFilter: level }),
            fetchLocalAuditLogs({ limit: 100 })
        ]);

        // Merge, apply server-side filters, and keep newest logs first.
        const providerLogs = [...vercelResult.logs, ...renderResult.logs];
        const allLogs = providerLogs.length > 0 ? providerLogs : localResult.logs;

        const mergedLogs = allLogs
            .filter((log) => {
                const matchesLevel = !level || log.level === level;
                const matchesAction = !action || log.action === action;
                const matchesSearch =
                    !search ||
                    [
                        log.description,
                        log.action,
                        log.level,
                        log.platform,
                        log.user?.name,
                        log.user?.email,
                        log.ipAddress
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase()
                        .includes(search);
                return matchesLevel && matchesAction && matchesSearch;
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Apply pagination after merge so page boundaries are global across both sources.
        const total = mergedLogs.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * limit;
        const logs = mergedLogs.slice(start, start + limit);

        res.set("Cache-Control", "no-store");
        res.json({
            logs,
            total,
            totalPages,
            page: safePage,
            sources: {
                vercel: {
                    connected: vercelResult.connected,
                    error: vercelResult.error
                },
                render: {
                    connected: renderResult.connected,
                    error: renderResult.error
                },
                local: {
                    connected: localResult.connected,
                    error: localResult.error
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
            error: error.message
        });
    }
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
    general: { siteName: "EduHub LMS", siteDescription: "...", contactEmail: "...", supportPhone: "...", timezone: "UTC + 5:30", dateFormat: "DD/MM/YYYY", timeFormat: "12h" },
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
