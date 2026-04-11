import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Note } from "../models/Note.js";
import { Book } from "../models/Book.js";
import { ResearchPaper } from "../models/ResearchPaper.js";

export const getModerationOverview = async (req, res) => {
    const [
        totalUsers,
        totalCourses,
        totalNotes,
        totalBooks,
        totalPapers,
        recentNotes,
        recentBooks,
        recentPapers,
    ] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Note.countDocuments(),
        Book.countDocuments(),
        ResearchPaper.countDocuments(),
        Note.find().sort({ createdAt: -1 }).limit(6).select("_id title subject createdAt").populate("uploadedBy", "name"),
        Book.find().sort({ createdAt: -1 }).limit(6).select("_id title category createdAt").populate("uploadedBy", "name"),
        ResearchPaper.find().sort({ createdAt: -1 }).limit(6).select("_id title field createdAt").populate("uploadedBy", "name"),
    ]);

    res.json({
        overview: {
            totalUsers,
            totalCourses,
            totalContent: totalNotes + totalBooks + totalPapers,
            totalNotes,
            totalBooks,
            totalPapers,
        },
        recentNotes,
        recentBooks,
        recentPapers,
    });
};

export const getModerationNotes = async (req, res) => {
    const notes = await Note.find().sort({ createdAt: -1 }).populate("uploadedBy", "name email");
    res.json({ notes });
};

export const getModerationBooks = async (req, res) => {
    const books = await Book.find().sort({ createdAt: -1 }).populate("uploadedBy", "name email");
    res.json({ books });
};

export const getModerationPapers = async (req, res) => {
    const papers = await ResearchPaper.find().sort({ createdAt: -1 }).populate("uploadedBy", "name email");
    res.json({ papers });
};

export const deleteModerationNote = async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Note deleted" });
};

export const deleteModerationBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Book deleted" });
};

export const deleteModerationPaper = async (req, res) => {
    await ResearchPaper.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Research paper deleted" });
};