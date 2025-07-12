import { Course } from "../models/Course.js";
import { User } from "../models/User.js";

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('createdBy', 'name');
        
        // Transform the data to match the frontend expectations
        const transformedCourses = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.createdBy?.name || "Unknown Instructor",
            duration: "8 weeks", // Default duration
            level: course.level,
            category: course.category,
            thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=" + course.title.substring(0, 2),
            price: "$49", // Default price
            rating: 4.5, // Default rating
            students: Math.floor(Math.random() * 2000) + 500, // Random student count
            syllabus: [
                "Introduction to " + course.title,
                "Basic Concepts",
                "Advanced Topics",
                "Practical Applications",
                "Final Project"
            ],
            requirements: [
                "Basic computer knowledge",
                "Willingness to learn",
                "A computer with internet connection"
            ]
        }));

        res.status(200).json({
            success: true,
            message: "All courses",
            data: transformedCourses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id).populate('createdBy', 'name');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Transform the data
        const transformedCourse = {
            _id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.createdBy?.name || "Unknown Instructor",
            duration: "8 weeks",
            level: course.level,
            category: course.category,
            thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=" + course.title.substring(0, 2),
            price: "$49",
            rating: 4.5,
            students: Math.floor(Math.random() * 2000) + 500,
            syllabus: [
                "Introduction to " + course.title,
                "Basic Concepts",
                "Advanced Topics",
                "Practical Applications",
                "Final Project"
            ],
            requirements: [
                "Basic computer knowledge",
                "Willingness to learn",
                "A computer with internet connection"
            ]
        };
        
        res.status(200).json({
            success: true,
            message: "Course found",
            data: transformedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if user is already enrolled
        const user = await User.findById(userId);
        if (user.Courses_Enrolled_In.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course"
            });
        }

        // Add course to user's enrolled courses
        user.Courses_Enrolled_In.push(courseId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully enrolled in course",
            courseId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('Courses_Enrolled_In');
        
        // Get enrolled course details
        const enrolledCourses = await Promise.all(
            user.Courses_Enrolled_In.map(async (courseId) => {
                const course = await Course.findById(courseId).populate('createdBy', 'name');
                if (course) {
                    return {
                        _id: course._id,
                        title: course.title,
                        description: course.description,
                        instructor: course.createdBy?.name || "Unknown Instructor",
                        duration: "8 weeks",
                        level: course.level,
                        category: course.category,
                        thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=" + course.title.substring(0, 2),
                        price: "$49",
                        rating: 4.5,
                        students: Math.floor(Math.random() * 2000) + 500,
                        syllabus: [
                            "Introduction to " + course.title,
                            "Basic Concepts",
                            "Advanced Topics",
                            "Practical Applications",
                            "Final Project"
                        ],
                        requirements: [
                            "Basic computer knowledge",
                            "Willingness to learn",
                            "A computer with internet connection"
                        ]
                    };
                }
                return null;
            })
        );

        const validCourses = enrolledCourses.filter(course => course !== null);

        res.status(200).json({
            success: true,
            message: "Enrolled courses retrieved successfully",
            data: validCourses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
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