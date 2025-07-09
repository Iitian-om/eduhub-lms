import mongoose from "mongoose";

const researchPaperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter research paper title"],
        trim: true,
        minLength: [5, "Title must be at least 5 characters"],
        maxLength: [200, "Title can't exceed 200 characters"],
    },
    abstract: {
        type: String,
        required: [true, "Please enter abstract"],
        trim: true,
        minLength: [50, "Abstract must be at least 50 characters"],
        maxLength: [1000, "Abstract can't exceed 1000 characters"],
    },
    authors: [{
        type: String,
        required: [true, "Please enter at least one author"],
        trim: true,
    }],
    field: {
        type: String,
        required: [true, "Please select an research field"],
        enum: [
            "Artificial Intelligence",
            "Biology",
            "Business",
            "Chemistry",
            "Computer Science",
            "Data Science",
            "Economics",
            "Engineering",
            "Humanities",
            "Machine Learning",
            "Mathematics",
            "Medicine",
            "Physics",
            "Psychology",
            "Social Sciences",
            "Other"
        ],
    },
    keywords: [{
        type: String,
        trim: true,
        required: [true, "Please enter at least one keyword"],
    }],
    publicationYear: {
        type: Number,
        required: [true, "Please enter publication year"],
        min: [1900, "Publication year must be after 1900"],
        max: [new Date().getFullYear(), "Publication year cannot be in the future"],
    },
    journal: {
        type: String,
        trim: true,
        required: false, // Optional - can be unpublished
    },
    doi: {
        type: String,
        trim: true,
        required: false, // Optional
    },
    fileUrl: {
        type: String,
        required: [true, "Research paper file is required"],
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
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    citations: {
        type: Number,
        default: 0,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    isPeerReviewed: {
        type: Boolean,
        default: false,
    },
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
researchPaperSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export const ResearchPaper = mongoose.model("ResearchPaper", researchPaperSchema); 