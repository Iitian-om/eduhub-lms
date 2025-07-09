import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter note title"],
        trim: true,
        minLength: [3, "Title must be at least 3 characters"],
        maxLength: [100, "Title can't exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter note description"],
        trim: true,
        minLength: [10, "Description must be at least 10 characters"],
        maxLength: [500, "Description can't exceed 500 characters"],
    },
    type: {
        type: String,
        enum: ["Lecture Notes", "Study Material", "Assignment", "Tutorial", "Summary", "Other"],
        default: "Lecture Notes",
        required: true,
    },
    subject: {
        type: String,
        required: [true, "Please enter subject"],
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false, // Optional - notes can be standalone
    },
    fileUrl: {
        type: String,
        required: [true, "Note file is required"],
    },
    fileSize: {
        type: Number,
        required: true,
        max: [2 * 1024 * 1024, "File size cannot exceed 2MB"], // 2MB in bytes
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
    
    // Rich text content for manual note writing
    richTextContent: {
        type: String,
        default: "",
    },
    
    // Type of note content (file upload or manual writing)
    contentType: {
        type: String,
        enum: ["file", "manual", "both"],
        default: "file",
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
noteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export const Note = mongoose.model("Note", noteSchema); 