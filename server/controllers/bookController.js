import { Book } from "../models/Book.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";

// Create a new book
export const createBook = async (req, res) => {
    try {
        const { title, description, author, category, level, tags, markdownContent } = req.body;

        // Validate required fields
        if (!title || !description || !author || !category || !level) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: title, description, author, category, level"
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Book file is required"
            });
        }

        // Upload file to Cloudinary
        const result = await uploadToCloudinary(req.file, "eduhub/books");
        
        // Create book in database
        const book = await Book.create({
            title: title.trim(),
            description: description.trim(),
            author: author.trim(),
            category,
            level,
            fileUrl: result.secure_url,
            fileSize: req.file.size,
            fileName: req.file.originalname,
            markdownContent: markdownContent || "",
            uploadedBy: req.user._id,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

        // Populate uploadedBy field
        await book.populate('uploadedBy', 'name userName profile_picture');

        res.status(201).json({
            success: true,
            message: "Book uploaded successfully",
            book
        });

    } catch (error) {
        console.error("Book creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload book",
            error: error.message
        });
    }
};

// Get all books with filtering and pagination
export const getAllBooks = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            level, 
            search, 
            author,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isPublic: true };
        
        if (category) filter.category = category;
        if (level) filter.level = level;
        if (author) filter.author = { $regex: author, $options: 'i' };
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const books = await Book.find(filter)
            .populate('uploadedBy', 'name userName profile_picture')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const totalBooks = await Book.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            books,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBooks / limit),
                totalBooks,
                hasNextPage: skip + books.length < totalBooks,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get books error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error: error.message
        });
    }
};

// Get book by ID
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id)
            .populate('uploadedBy', 'name userName profile_picture');

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Increment downloads
        book.downloads += 1;
        await book.save();

        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            book
        });

    } catch (error) {
        console.error("Get book error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error: error.message
        });
    }
};

// Update book
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, author, category, level, tags, isPublic, markdownContent } = req.body;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Check if user is the owner
        if (book.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own books"
            });
        }

        // Update fields
        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (author) updateData.author = author.trim();
        if (category) updateData.category = category;
        if (level) updateData.level = level;
        if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
        if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;
        if (markdownContent !== undefined) updateData.markdownContent = markdownContent;

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('uploadedBy', 'name userName profile_picture');

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book: updatedBook
        });

    } catch (error) {
        console.error("Update book error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error.message
        });
    }
};

// Delete book
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        // Check if user is the owner
        if (book.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own books"
            });
        }

        await Book.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });

    } catch (error) {
        console.error("Delete book error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error.message
        });
    }
};

// Get user's uploaded books
export const getUserBooks = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const books = await Book.find({ uploadedBy: userId, isPublic: true })
            .populate('uploadedBy', 'name userName profile_picture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalBooks = await Book.countDocuments({ uploadedBy: userId, isPublic: true });

        res.status(200).json({
            success: true,
            message: "User books retrieved successfully",
            books,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBooks / limit),
                totalBooks
            }
        });

    } catch (error) {
        console.error("Get user books error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve user books",
            error: error.message
        });
    }
}; 