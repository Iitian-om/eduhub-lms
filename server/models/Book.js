import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter book title"],
        trim: true,
        minLength: [3, "Title must be at least 3 characters"],
        maxLength: [100, "Title can't exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter book description"],
        trim: true,
        minLength: [10, "Description must be at least 10 characters"],
        maxLength: [500, "Description can't exceed 500 characters"],
    },
    author: {
        type: String,
        required: [true, "Please enter author name"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: [
            "Computer Science",
            "Mathematics", 
            "Physics",
            "Chemistry",
            "Biology",
            "Engineering",
            "Business",
            "Literature",
            "History",
            "Philosophy",
            "Psychology",
            "Economics",
            "Other"
        ],
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
        required: true,
    },
    fileUrl: {
        type: String,
        required: [true, "Book file is required"],
    },
    fileSize: {
        type: Number,
        required: true,
        max: [3 * 1024 * 1024, "File size cannot exceed 3MB"], // 3MB in bytes
    },
    fileName: {
        type: String,
        required: true,
    },
    // Markdown content for rich description
    markdownContent: {
        type: String,
        default: "",
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export const Book = mongoose.model("Book", bookSchema); 