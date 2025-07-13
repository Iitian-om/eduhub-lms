import { connectDB } from "./db.js";
import { Course } from "../models/Course.js";
import dotenv from "dotenv";

dotenv.config();

const sampleModules = [
  {
    title: "Introduction",
    description: "Get started with the course",
    lessons: [
      {
        title: "Welcome to the Course",
        description: "Introduction and course overview",
        content: "Welcome to this comprehensive course! In this lesson, you'll learn about the course structure and what to expect. We'll cover the fundamentals and set up your learning environment for success.",
        videoUrl: "",
        duration: 15,
        isCompleted: false
      },
      {
        title: "Course Setup",
        description: "Setting up your learning environment",
        content: "Learn how to set up your development environment and tools needed for this course. We'll install all necessary software and configure your workspace for optimal learning.",
        videoUrl: "",
        duration: 20,
        isCompleted: false
      },
      {
        title: "Learning Objectives",
        description: "What you'll achieve in this course",
        content: "Understand the key learning objectives and outcomes you'll achieve by completing this course. We'll outline the skills and knowledge you'll gain.",
        videoUrl: "",
        duration: 10,
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
        content: "This lesson covers the fundamental concepts that you'll need to understand throughout the course. We'll explore the core principles and foundational knowledge.",
        videoUrl: "",
        duration: 25,
        isCompleted: false
      },
      {
        title: "Key Terminology",
        description: "Important terms and definitions",
        content: "Learn the essential terminology and definitions used in this field. Understanding these terms will help you communicate effectively and grasp advanced concepts.",
        videoUrl: "",
        duration: 18,
        isCompleted: false
      },
      {
        title: "Advanced Topics",
        description: "Diving deeper into advanced concepts",
        content: "Explore advanced topics and techniques that will help you master the subject matter. We'll cover complex concepts and their practical applications.",
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
        content: "Put your knowledge to the test with hands-on exercises and real-world projects. Practice is essential for mastering any skill, and this lesson provides plenty of opportunities.",
        videoUrl: "",
        duration: 45,
        isCompleted: false
      },
      {
        title: "Real-world Examples",
        description: "See concepts in action",
        content: "Explore real-world examples and case studies that demonstrate how the concepts you've learned are applied in professional settings.",
        videoUrl: "",
        duration: 35,
        isCompleted: false
      },
      {
        title: "Final Project",
        description: "Complete your final project",
        content: "Apply all the concepts you've learned to complete a comprehensive final project. This project will showcase your skills and serve as a portfolio piece.",
        videoUrl: "",
        duration: 60,
        isCompleted: false
      }
    ]
  },
  {
    title: "Assessment & Review",
    description: "Test your knowledge and review",
    lessons: [
      {
        title: "Knowledge Check",
        description: "Assess your understanding",
        content: "Take a comprehensive quiz to assess your understanding of the course material. This will help identify areas where you may need additional review.",
        videoUrl: "",
        duration: 20,
        isCompleted: false
      },
      {
        title: "Course Review",
        description: "Review key concepts",
        content: "Review all the key concepts covered in the course. This lesson provides a comprehensive summary to reinforce your learning.",
        videoUrl: "",
        duration: 25,
        isCompleted: false
      },
      {
        title: "Next Steps",
        description: "Continue your learning journey",
        content: "Learn about the next steps in your learning journey and how to continue building on the knowledge you've gained in this course.",
        videoUrl: "",
        duration: 15,
        isCompleted: false
      }
    ]
  }
];

const addCourseContent = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Get all courses that don't have modules
    const courses = await Course.find({ $or: [{ modules: { $exists: false } }, { modules: { $size: 0 } }] });
    
    if (courses.length === 0) {
      console.log("All courses already have content!");
      process.exit(0);
    }

    console.log(`Found ${courses.length} courses without content. Adding sample modules...`);

    for (const course of courses) {
      // Add sample modules to the course
      course.modules = sampleModules;
      await course.save();
      console.log(`✅ Added content to course: ${course.title}`);
    }

    console.log("🎉 Successfully added content to all courses!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding course content:", error);
    process.exit(1);
  }
};

// Run the script
addCourseContent(); 