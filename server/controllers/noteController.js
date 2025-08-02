import { Note } from "../models/Note.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";

// Create a new note
export const createNote = async (req, res) => {
    try {
        const { title, description, type, subject, course, tags, markdownContent, richTextContent, contentType } = req.body;

        // Validate required fields
        if (!title || !description || !type || !subject) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: title, description, type, subject"
            });
        }

        // Validate content type
        if (contentType && !["file", "manual", "both"].includes(contentType)) {
            return res.status(400).json({
                success: false,
                message: "Content type must be 'file', 'manual', or 'both'"
            });
        }

        // Check if file is required based on content type
        const finalContentType = contentType || "file";
        if ((finalContentType === "file" || finalContentType === "both") && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Note file is required for file-based content"
            });
        }

        let fileUrl = "";
        let fileSize = 0;
        let fileName = "";

        // Upload file to Cloudinary if needed
        if (req.file) {
            const result = await uploadToCloudinary(req.file, "eduhub/notes");
            fileUrl = result.secure_url;
            fileSize = req.file.size;
            fileName = req.file.originalname;
        }
        
        // Create note in database
        const note = await Note.create({
            title: title.trim(),
            description: description.trim(),
            type,
            subject: subject.trim(),
            course: course || null,
            fileUrl,
            fileSize,
            fileName,
            markdownContent: markdownContent || "",
            richTextContent: richTextContent || "",
            contentType: finalContentType,
            uploadedBy: req.user._id,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

        // Populate uploadedBy and course fields
        await note.populate('uploadedBy', 'name userName profile_picture');
        if (course) {
            await note.populate('course', 'title');
        }

        res.status(201).json({
            success: true,
            message: "Note uploaded successfully",
            note
        });

    } catch (error) {
        console.error("Note creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload note",
            error: error.message
        });
    }
};

// Get all notes with filtering and pagination
export const getAllNotes = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            type, 
            subject, 
            search, 
            course,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isPublic: true };
        
        if (type) filter.type = type;
        if (subject) filter.subject = { $regex: subject, $options: 'i' };
        if (course) filter.course = course;
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const notes = await Note.find(filter)
            .populate('uploadedBy', 'name userName profile_picture')
            .populate('course', 'title')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const totalNotes = await Note.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            notes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalNotes / limit),
                totalNotes,
                hasNextPage: skip + notes.length < totalNotes,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get notes error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve notes",
            error: error.message
        });
    }
};

// Get note by ID
export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id)
            .populate('uploadedBy', 'name userName profile_picture')
            .populate('course', 'title');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Increment downloads
        note.downloads += 1;
        await note.save();

        res.status(200).json({
            success: true,
            message: "Note retrieved successfully",
            note
        });

    } catch (error) {
        console.error("Get note error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve note",
            error: error.message
        });
    }
};

// Update note
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, subject, course, tags, isPublic, markdownContent, richTextContent, contentType } = req.body;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Check if user is the owner
        if (note.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own notes"
            });
        }

        // Validate content type if provided
        if (contentType && !["file", "manual", "both"].includes(contentType)) {
            return res.status(400).json({
                success: false,
                message: "Content type must be 'file', 'manual', or 'both'"
            });
        }

        // Update fields
        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (type) updateData.type = type;
        if (subject) updateData.subject = subject.trim();
        if (course) updateData.course = course;
        if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
        if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;
        if (markdownContent !== undefined) updateData.markdownContent = markdownContent;
        if (richTextContent !== undefined) updateData.richTextContent = richTextContent;
        if (contentType) updateData.contentType = contentType;

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('uploadedBy', 'name userName profile_picture')
        .populate('course', 'title');

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: updatedNote
        });

    } catch (error) {
        console.error("Update note error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update note",
            error: error.message
        });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Check if user is the owner
        if (note.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own notes"
            });
        }

        await Note.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete note",
            error: error.message
        });
    }
};

// Get user's uploaded notes
export const getUserNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const notes = await Note.find({ uploadedBy: userId, isPublic: true })
            .populate('uploadedBy', 'name userName profile_picture')
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalNotes = await Note.countDocuments({ uploadedBy: userId, isPublic: true });

        res.status(200).json({
            success: true,
            message: "User notes retrieved successfully",
            notes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalNotes / limit),
                totalNotes
            }
        });

    } catch (error) {
        console.error("Get user notes error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve user notes",
            error: error.message
        });
    }
};

// Get notes by course
export const getNotesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const notes = await Note.find({ course: courseId, isPublic: true })
            .populate('uploadedBy', 'name userName profile_picture')
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalNotes = await Note.countDocuments({ course: courseId, isPublic: true });

        res.status(200).json({
            success: true,
            message: "Course notes retrieved successfully",
            notes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalNotes / limit),
                totalNotes
            }
        });

    } catch (error) {
        console.error("Get course notes error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve course notes",
            error: error.message
        });
    }
}; 