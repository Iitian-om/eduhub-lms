// --- Core Node Modules & Packages ---
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import cors from "cors"; // Uncomment if you need to enable CORS

// --- Local Module Imports ---
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import otherRoutes from "./routes/otherRoutes.js"; // General routes like root and /about or pages route.
import pageNotFound from "./routes/pageNotFound.js"; // Middleware to handle 404 errors

// --- Environment Variables Configuration ---
dotenv.config();

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT;

// --- Core Middlewares ---
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies from headers

// --- API Routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payment", paymentRoutes); // Added payment routes
app.use("/", otherRoutes); // General routes like root and /about

// --- Page Not Found Middleware --- This must be the last app.use() call for it to work correctly
app.use(pageNotFound); // Middleware to handle 404 errors



// Starting the server only after a successful database connection
connectDB().then(() => {
    // Starting the server
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