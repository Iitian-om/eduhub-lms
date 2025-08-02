import { ResearchPaper } from "../models/ResearchPaper.js";
import { uploadToCloudinary } from "../middlewares/fileUpload.js";

// Create a new research paper
export const createResearchPaper = async (req, res) => {
    try {
        const { 
            title, 
            abstract, 
            authors, 
            field, 
            keywords, 
            publicationYear, 
            journal, 
            doi,
            isPeerReviewed,
            markdownContent
        } = req.body;

        // Validate required fields
        if (!title || !abstract || !authors || !field || !keywords || !publicationYear) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: title, abstract, authors, field, keywords, publicationYear"
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Research paper file is required"
            });
        }

        // Upload file to Cloudinary
        const result = await uploadToCloudinary(req.file, "eduhub/researchPapers");
        
        // Parse authors and keywords
        const authorsArray = authors.split(',').map(author => author.trim());
        const keywordsArray = keywords.split(',').map(keyword => keyword.trim());

        // Create research paper in database
        const researchPaper = await ResearchPaper.create({
            title: title.trim(),
            abstract: abstract.trim(),
            authors: authorsArray,
            field,
            keywords: keywordsArray,
            publicationYear: parseInt(publicationYear),
            journal: journal ? journal.trim() : null,
            doi: doi ? doi.trim() : null,
            fileUrl: result.secure_url,
            fileSize: req.file.size,
            fileName: req.file.originalname,
            markdownContent: markdownContent || "",
            uploadedBy: req.user._id,
            isPeerReviewed: isPeerReviewed === 'true'
        });

        // Populate uploadedBy field
        await researchPaper.populate('uploadedBy', 'name userName profile_picture');

        res.status(201).json({
            success: true,
            message: "Research paper uploaded successfully",
            researchPaper
        });

    } catch (error) {
        console.error("Research paper creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload research paper",
            error: error.message
        });
    }
};

// Get all research papers with filtering and pagination
export const getAllResearchPapers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            field, 
            search, 
            publicationYear,
            author,
            isPeerReviewed,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isPublic: true };
        
        if (field) filter.field = field;
        if (publicationYear) filter.publicationYear = parseInt(publicationYear);
        if (isPeerReviewed) filter.isPeerReviewed = isPeerReviewed === 'true';
        if (author) filter.authors = { $regex: author, $options: 'i' };
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { abstract: { $regex: search, $options: 'i' } },
                { authors: { $in: [new RegExp(search, 'i')] } },
                { keywords: { $in: [new RegExp(search, 'i')] } },
                { journal: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const researchPapers = await ResearchPaper.find(filter)
            .populate('uploadedBy', 'name userName profile_picture')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const totalPapers = await ResearchPaper.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Research papers retrieved successfully",
            researchPapers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPapers / limit),
                totalPapers,
                hasNextPage: skip + researchPapers.length < totalPapers,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get research papers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve research papers",
            error: error.message
        });
    }
};

// Get research paper by ID
export const getResearchPaperById = async (req, res) => {
    try {
        const { id } = req.params;

        const researchPaper = await ResearchPaper.findById(id)
            .populate('uploadedBy', 'name userName profile_picture');

        if (!researchPaper) {
            return res.status(404).json({
                success: false,
                message: "Research paper not found"
            });
        }

        // Increment downloads
        researchPaper.downloads += 1;
        await researchPaper.save();

        res.status(200).json({
            success: true,
            message: "Research paper retrieved successfully",
            researchPaper
        });

    } catch (error) {
        console.error("Get research paper error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve research paper",
            error: error.message
        });
    }
};

// Update research paper
export const updateResearchPaper = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            abstract, 
            authors, 
            field, 
            keywords, 
            publicationYear, 
            journal, 
            doi,
            isPeerReviewed,
            isPublic 
        } = req.body;

        const researchPaper = await ResearchPaper.findById(id);

        if (!researchPaper) {
            return res.status(404).json({
                success: false,
                message: "Research paper not found"
            });
        }

        // Check if user is the owner
        if (researchPaper.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own research papers"
            });
        }

        // Update fields
        const updateData = {};
        if (title) updateData.title = title.trim();
        if (abstract) updateData.abstract = abstract.trim();
        if (authors) updateData.authors = authors.split(',').map(author => author.trim());
        if (field) updateData.field = field;
        if (keywords) updateData.keywords = keywords.split(',').map(keyword => keyword.trim());
        if (publicationYear) updateData.publicationYear = parseInt(publicationYear);
        if (journal) updateData.journal = journal.trim();
        if (doi) updateData.doi = doi.trim();
        if (typeof isPeerReviewed === 'boolean') updateData.isPeerReviewed = isPeerReviewed;
        if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;

        const updatedPaper = await ResearchPaper.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('uploadedBy', 'name userName profile_picture');

        res.status(200).json({
            success: true,
            message: "Research paper updated successfully",
            researchPaper: updatedPaper
        });

    } catch (error) {
        console.error("Update research paper error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update research paper",
            error: error.message
        });
    }
};

// Delete research paper
export const deleteResearchPaper = async (req, res) => {
    try {
        const { id } = req.params;

        const researchPaper = await ResearchPaper.findById(id);

        if (!researchPaper) {
            return res.status(404).json({
                success: false,
                message: "Research paper not found"
            });
        }

        // Check if user is the owner
        if (researchPaper.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own research papers"
            });
        }

        await ResearchPaper.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Research paper deleted successfully"
        });

    } catch (error) {
        console.error("Delete research paper error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete research paper",
            error: error.message
        });
    }
};

// Get user's uploaded research papers
export const getUserResearchPapers = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const researchPapers = await ResearchPaper.find({ uploadedBy: userId, isPublic: true })
            .populate('uploadedBy', 'name userName profile_picture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalPapers = await ResearchPaper.countDocuments({ uploadedBy: userId, isPublic: true });

        res.status(200).json({
            success: true,
            message: "User research papers retrieved successfully",
            researchPapers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPapers / limit),
                totalPapers
            }
        });

    } catch (error) {
        console.error("Get user research papers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve user research papers",
            error: error.message
        });
    }
};

// Increment citations
export const incrementCitations = async (req, res) => {
    try {
        const { id } = req.params;

        const researchPaper = await ResearchPaper.findById(id);

        if (!researchPaper) {
            return res.status(404).json({
                success: false,
                message: "Research paper not found"
            });
        }

        researchPaper.citations += 1;
        await researchPaper.save();

        res.status(200).json({
            success: true,
            message: "Citations updated successfully",
            citations: researchPaper.citations
        });

    } catch (error) {
        console.error("Increment citations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update citations",
            error: error.message
        });
    }
}; 