import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter course title"],
        minLength: [4, "Title must be at least 4 characters"],
        maxLength: [80, "Title can't exceed 80 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter course description"],
        minLength: [20, "Description must be at least 20 characters long"],
    },
    category: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lectures: [
        {
            title: String,
            description: String,
            videoUrl: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Course = mongoose.model("Course", courseSchema); 