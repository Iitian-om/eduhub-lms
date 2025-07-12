// Sample Courses for demo - Only adds courses if none exist
import { connectDB } from "./db.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if MONGO_URI is available
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI environment variable is not set!");
    console.log("Please create a .env file in the server directory with your MongoDB connection string.");
    console.log("Example: MONGO_URI=mongodb://localhost:27017/eduhub");
    console.log("Or use your production MongoDB Atlas connection string.");
    process.exit(1);
}

const sampleCourses = [
    {
        title: "JavaScript Basics",
        description: "Learn the basics of JavaScript programming language. This comprehensive course covers everything from variables and data types to advanced concepts like closures and async programming.",
        category: "Programming",
        level: "Beginner",
        instructor: "John Doe",
        duration: "8 weeks",
        thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=JS",
        price: "$0",
        rating: 4.5,
        students: 1250,
        syllabus: [
            "Introduction to JavaScript",
            "Variables and Data Types",
            "Control Structures",
            "Functions and Scope",
            "Arrays and Objects",
            "DOM Manipulation",
            "Events and Event Handling",
            "Final Project"
        ],
        requirements: [
            "Basic computer knowledge",
            "No prior programming experience required",
            "A computer with internet connection"
        ]
    },
    {
        title: "React.js Course",
        description: "Build modern web applications with React.js. Learn component-based architecture, state management, and best practices for building scalable applications.",
        category: "Web Development",
        level: "Intermediate",
        instructor: "Jane Smith",
        duration: "10 weeks",
        thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=React",
        price: "$69",
        rating: 4.8,
        students: 1500,
        syllabus: [
            "React Fundamentals",
            "Components and Props",
            "State and Lifecycle",
            "Hooks and Functional Components",
            "Routing with React Router",
            "State Management with Redux",
            "Testing React Applications",
            "Deployment and Optimization"
        ],
        requirements: [
            "Basic JavaScript knowledge",
            "Understanding of HTML and CSS",
            "Familiarity with ES6 syntax"
        ]
    },
    {
        title: "Data Science",
        description: "Introduction to data science and machine learning. Learn to analyze data, build predictive models, and extract meaningful insights from complex datasets.",
        category: "Data Science",
        level: "Advanced",
        instructor: "Mike Johnson",
        duration: "12 weeks",
        thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=Data",
        price: "$99",
        rating: 4.7,
        students: 1800,
        syllabus: [
            "Introduction to Data Science",
            "Python for Data Science",
            "Data Cleaning and Preprocessing",
            "Exploratory Data Analysis",
            "Statistical Analysis",
            "Machine Learning Basics",
            "Supervised Learning",
            "Unsupervised Learning"
        ],
        requirements: [
            "Basic Python programming",
            "Understanding of statistics",
            "Linear algebra fundamentals"
        ]
    },
    {
        title: "Python Basics",
        description: "Start your programming journey with Python. This beginner-friendly course covers all the fundamentals you need to start coding in Python.",
        category: "Programming",
        level: "Beginner",
        instructor: "Sarah Wilson",
        duration: "6 weeks",
        thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=Python",
        price: "$39",
        rating: 4.6,
        students: 3200,
        syllabus: [
            "Introduction to Python",
            "Variables and Data Types",
            "Control Flow",
            "Functions and Modules",
            "File Handling",
            "Object-Oriented Programming"
        ],
        requirements: [
            "No prior programming experience",
            "Basic computer skills",
            "Willingness to learn"
        ]
    },
    {
        title: "Full Stack Dev",
        description: "Learn both frontend and backend development. Master the complete web development stack from database design to user interface.",
        category: "Web Development",
        level: "Advanced",
        instructor: "David Brown",
        duration: "16 weeks",
        thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=Full+Stack",
        price: "$129",
        rating: 4.9,
        students: 950,
        syllabus: [
            "HTML, CSS, and JavaScript",
            "React.js Frontend",
            "Node.js Backend",
            "Database Design",
            "API Development",
            "Authentication and Security",
            "Deployment Strategies",
            "Project Portfolio"
        ],
        requirements: [
            "Basic programming concepts",
            "Understanding of web technologies",
            "Commitment to 16-week program"
        ]
    },
    {
        title: "Machine Learning",
        description: "Introduction to machine learning algorithms. Learn the fundamentals of ML and how to implement various algorithms using Python.",
        category: "Data Science",
        level: "Intermediate",
        instructor: "Lisa Chen",
        duration: "14 weeks",
        thumbnail: "https://via.placeholder.com/300x200/29C7C9/FFFFFF?text=ML",
        price: "$89",
        rating: 4.4,
        students: 1400,
        syllabus: [
            "Introduction to Machine Learning",
            "Linear Regression",
            "Logistic Regression",
            "Decision Trees",
            "Random Forests",
            "Support Vector Machines",
            "Neural Networks",
            "Model Evaluation"
        ],
        requirements: [
            "Python programming skills",
            "Basic statistics knowledge",
            "Linear algebra understanding"
        ]
    }
];

const seedCourses = async () => {
    try {
        await connectDB();
        
        // Check if courses already exist
        const existingCourses = await Course.countDocuments();
        
        if (existingCourses > 0) {
            console.log(`✅ Database already has ${existingCourses} courses. Skipping seeding to preserve existing data.`);
            console.log("If you want to add sample courses, please delete existing courses first or modify this script.");
            process.exit(0);
        }
        
        console.log("📚 No existing courses found. Adding sample courses...");
        
        // Get a default instructor (first admin user or create one)
        let instructor = await User.findOne({ role: "Admin" });
        if (!instructor) {
            instructor = await User.findOne({ role: "Instructor" });
        }
        if (!instructor) {
            console.log("No admin or instructor found. Creating a default instructor...");
            instructor = await User.create({
                name: "Default Instructor",
                userName: "instructor",
                email: "instructor@eduhub.com",
                password: "password123",
                role: "Instructor"
            });
        }
        
        // Create courses
        const courses = await Course.create(
            sampleCourses.map(course => ({
                title: course.title,
                description: course.description,
                category: course.category,
                level: course.level,
                createdBy: instructor._id
            }))
        );
        
        console.log(`✅ Successfully seeded/added ${courses.length} sample courses`);
        console.log("📋 Courses added:");
        courses.forEach(course => console.log(`   - ${course.title}`));
        console.log("\n🎉 Your courses page should now display these sample courses!");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding courses:", error);
        process.exit(1);
    }
};

// Run the seeding function
seedCourses(); 