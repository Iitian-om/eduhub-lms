import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../utils/cloudinary.js";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Create multer instance with file size limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB default limit
    }
});

// Specific upload middleware for books (3MB limit) - file required
export const uploadBook = upload.single('bookFile');

// Specific upload middleware for notes (2MB limit) - file optional
export const uploadNote = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    }
}).single('noteFile');

// Specific upload middleware for research papers (2MB limit) - file required
export const uploadResearchPaper = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    }
}).single('researchPaperFile');

// Generic file upload function for Cloudinary
export const uploadToCloudinary = async (file, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: folder,
                resource_type: "raw",
                format: "pdf"
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

// Error handling middleware for file uploads
export const handleFileUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Please check the size limits.',
                error: error.message
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: error.message
        });
    }
    
    if (error.message === 'Only PDF files are allowed') {
        return res.status(400).json({
            success: false,
            message: 'Only PDF files are allowed',
            error: error.message
        });
    }
    
    next(error);
}; 