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

        // Add user to course's enrolled students (if not already there)
        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
        }

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

export const checkEnrollment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check enrollment using User model instead of Course model
        const user = await User.findById(userId);
        const isEnrolled = user.Courses_Enrolled_In.includes(courseId);

        res.status(200).json({
            success: true,
            isEnrolled,
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

export const createCourse = async (req, res) => {
    const { title, description, category, level } = req.body;

    if (!title || !description || !category || !level) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields",
        });
    }

    try {
        // Sample modules for new courses
        const sampleModules = [
            {
                title: "Introduction",
                description: "Get started with the course",
                lessons: [
                    {
                        title: "Welcome to the Course",
                        description: "Introduction and course overview",
                        content: "Welcome to this comprehensive course! In this lesson, you'll learn about the course structure and what to expect.",
                        videoUrl: "",
                        duration: 15,
                        isCompleted: false
                    },
                    {
                        title: "Course Setup",
                        description: "Setting up your learning environment",
                        content: "Learn how to set up your development environment and tools needed for this course.",
                        videoUrl: "",
                        duration: 20,
                        isCompleted: false
                    }
                ]
            },
            {
                title: "Core Concepts",
                description: "Learn the fundamental concepts",
                lessons: [
                    {
                        title: "Basic Concepts",
                        description: "Understanding the basics",
                        content: "This lesson covers the fundamental concepts that you'll need to understand throughout the course.",
                        videoUrl: "",
                        duration: 25,
                        isCompleted: false
                    },
                    {
                        title: "Advanced Topics",
                        description: "Diving deeper into advanced concepts",
                        content: "Explore advanced topics and techniques that will help you master the subject matter.",
                        videoUrl: "",
                        duration: 30,
                        isCompleted: false
                    }
                ]
            },
            {
                title: "Practical Applications",
                description: "Apply what you've learned",
                lessons: [
                    {
                        title: "Hands-on Practice",
                        description: "Practical exercises and projects",
                        content: "Put your knowledge to the test with hands-on exercises and real-world projects.",
                        videoUrl: "",
                        duration: 45,
                        isCompleted: false
                    },
                    {
                        title: "Final Project",
                        description: "Complete your final project",
                        content: "Apply all the concepts you've learned to complete a comprehensive final project.",
                        videoUrl: "",
                        duration: 60,
                        isCompleted: false
                    }
                ]
            }
        ];

        const course = await Course.create({
            title,
            description,
            category,
            level,
            createdBy: req.user._id,
            modules: sampleModules,
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

// 
export const markLessonComplete = async (req, res) => {
    try {
        const { courseId, moduleIndex, lessonIndex } = req.body;
        const userId = req.user._id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if user is enrolled
        const user = await User.findById(userId);
        if (!user.Courses_Enrolled_In.includes(courseId)) {
            return res.status(403).json({
                success: false,
                message: "You must be enrolled to mark lessons as complete"
            });
        }

        // Validate module and lesson indices
        if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
            return res.status(400).json({
                success: false,
                message: "Invalid module or lesson index"
            });
        }

        // Create unique lesson identifier
        const lessonId = `${moduleIndex}-${lessonIndex}`;

        // Initialize course progress if it doesn't exist
        if (!user.CourseProgress.has(courseId.toString())) {
            const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
            user.CourseProgress.set(courseId.toString(), {
                completedLessons: [],
                totalLessons,
                completionPercentage: 0,
                lastAccessed: new Date()
            });
        }

        const progress = user.CourseProgress.get(courseId.toString());

        // Add lesson to completed lessons if not already completed
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            progress.completionPercentage = Math.round((progress.completedLessons.length / progress.totalLessons) * 100);
            progress.lastAccessed = new Date();
        }

        user.CourseProgress.set(courseId.toString(), progress);
        await user.save();

        // Check if course is completed (all lessons done)
        if (progress.completionPercentage === 100 && !user.Courses_Completed.includes(courseId)) {
            user.Courses_Completed.push(courseId);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Lesson marked as complete",
            progress: {
                completedLessons: progress.completedLessons.length,
                totalLessons: progress.totalLessons,
                completionPercentage: progress.completionPercentage,
                isCourseCompleted: progress.completionPercentage === 100
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// 
export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const progress = user.CourseProgress.get(courseId);
        
        if (!progress) {
            return res.status(200).json({
                success: true,
                progress: {
                    completedLessons: 0,
                    totalLessons: 0,
                    completionPercentage: 0,
                    isCourseCompleted: false
                }
            });
        }

        res.status(200).json({
            success: true,
            progress: {
                completedLessons: progress.completedLessons.length,
                totalLessons: progress.totalLessons,
                completionPercentage: progress.completionPercentage,
                isCourseCompleted: progress.completionPercentage === 100
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// 
export const markCourseComplete = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user is enrolled
        if (!user.Courses_Enrolled_In.includes(courseId)) {
            return res.status(403).json({
                success: false,
                message: "You must be enrolled to complete this course"
            });
        }

        // Check if course is already completed
        if (user.Courses_Completed.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Course is already completed"
            });
        }

        // Add to completed courses
        user.Courses_Completed.push(courseId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Course marked as completed",
            completedCourses: user.Courses_Completed.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};