// Importing the necessary modules
import express from "express";
import dotenv from "dotenv";

// Importing the routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import otherRoutes from "./routes/otherRoutes.js";

// Configuring the environment variables
dotenv.config();

const app = express(); // Creating the express app
app.use(express.json()); // Middleware
const PORT = process.env.PORT; // Setting the port

// Add this root route:
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/", otherRoutes);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)    
});

export default app; // Exporting the app