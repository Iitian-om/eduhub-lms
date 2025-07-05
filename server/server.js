// --- Core Node Modules & Packages ---
import "dotenv/config"; // Load environment variables from .env file at the very top
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";

// --- Local Module Imports ---
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import researchPaperRoutes from "./routes/researchPaperRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import otherRoutes from "./routes/otherRoutes.js"; // General routes like root and /about or pages route.
import pageNotFound from "./routes/pageNotFound.js"; // Middleware to handle 404 errors

// --- Environment Variables Configuration ---
dotenv.config(); // Make sure .env variables are loaded before anything else

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT;

// --- Core Middlewares ---
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies from headers

// --- Additional Middlewares ---
app.use("/uploads", express.static(path.join(process.cwd(), "server/uploads")));

// --- CORS Configuration ---
const allowedOrigins = [
  "https://eduhub-lms-rose.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// --- API Routes ---
app.use("/api/v1/auth", authRoutes); // Auth routes (register, login)
app.use("/api/v1/users", userRoutes); // User profile and related routes
app.use("/api/v1/courses", courseRoutes); // Course-related routes
app.use("/api/v1/books", bookRoutes); // Book-related routes
app.use("/api/v1/notes", noteRoutes); // Note-related routes
app.use("/api/v1/research-papers", researchPaperRoutes); // Research paper routes
app.use("/api/v1/payment", paymentRoutes); // Payment routes
app.use("/", otherRoutes); // General routes like root and /about

// --- Page Not Found Middleware --- This must be the last app.use() call for it to work correctly
app.use(pageNotFound); // Middleware to handle 404 errors

// --- Server Startup Sequence --- Connect to the database first, then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Hence Development Server started running on port ${PORT}`)
    });
}).catch(
    (error) => {
        // Log the error and exit the process
        console.error("Server isn't started due to DB connection Failure:", error)
        process.exit(1); // Exit the process with a failure code
    }
);


export default app;