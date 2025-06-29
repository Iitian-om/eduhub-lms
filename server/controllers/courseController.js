import { Course } from "../models/Course.js";

export const getAllCourses = (req, res) => {
    res.status(200).json({
        success: true,
        message: "All courses",
        data: []
    });
};

export const createCourse = async (req, res) => {
    const { title, description, category, level } = req.body;

    if (!title || !description || !category || !level) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields",
        });
    }

    try {
        const course = await Course.create({
            title,
            description,
            category,
            level,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};