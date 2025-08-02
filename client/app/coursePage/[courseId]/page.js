"use client";

import UserContext from '../../context/UserContext'; // ✅ Correct for your file!
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/api";
import toast from "react-hot-toast";
import { use } from "react";

export default function CoursePage({ params }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const { courseId } = use(params);
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [courseProgress, setCourseProgress] = useState({
    completedLessons: 0,
    totalLessons: 0,
    completionPercentage: 0,
    isCourseCompleted: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && courseId) {
      fetchCourseDetails();
      checkEnrollmentStatus();
      fetchCourseProgress();
    }
  }, [user, courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setCourse(data.data);
        // Add sample modules if none exist
        if (!data.data.modules || data.data.modules.length === 0) {
          setCourse({
            ...data.data,
            modules: [
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
            ]
          });
        }
      } else {
        toast.error("Course not found");
        router.push("/courses");
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error("Failed to load course");
    } finally {
      setCourseLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses/check-enrollment/${courseId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // fetchCourseProgress From backend API
  const fetchCourseProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses/progress/${courseId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setCourseProgress(data.progress);
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEnrolled(true);
        toast.success("Successfully enrolled in course!");
      } else if (data.message && data.message.includes("already enrolled")) {
        // If already enrolled, just update the state and show a different message
        setIsEnrolled(true);
        toast.success("Welcome back! You're already enrolled in this course.");
      } else {
        toast.error(data.message || "Failed to enroll");
      }
    } catch (error) {
      toast.error("Failed to enroll in course");
    }
  };

  const markLessonComplete = async (moduleIndex, lessonIndex) => {
    if (!course) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses/lesson/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseId: course._id,
          moduleIndex,
          lessonIndex
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        const updatedCourse = { ...course };
        updatedCourse.modules[moduleIndex].lessons[lessonIndex].isCompleted = true;
        setCourse(updatedCourse);
        
        toast.success("Lesson marked as complete!");
        
        // Update progress state
        setCourseProgress(data.progress);
        
        // Show completion message if course is completed
        if (data.progress.isCourseCompleted) {
          toast.success("🎉 Congratulations! You've completed this course!");
        }
      } else {
        toast.error(data.message || "Failed to mark lesson as complete");
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast.error("Failed to mark lesson as complete");
    }
  };

  if (loading || courseLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29C7C9] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <button 
            onClick={() => router.push("/courses")}
            className="bg-[#29C7C9] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#22b3b5] transition"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center px-4">
        <div className="max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-[#22292F] mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Enrollment Required</h3>
            <p className="text-yellow-700 text-sm">
              You need to enroll in this course to access the learning content. 
              Only enrolled students can view the course materials.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleEnroll}
              className="bg-[#29C7C9] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#22b3b5] transition"
            >
              Enroll Now
            </button>
            <button
              onClick={() => router.push("/courses")}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Browse Other Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      {/* Course Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#22292F]">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>👨‍🏫 {course.instructor}</span>
                <span>⏱️ {course.duration}</span>
                <span>📊 {course.level}</span>
                <span>📁 {course.category}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Course Progress</span>
                  <span>{courseProgress.completionPercentage}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#29C7C9] h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${courseProgress.completionPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {courseProgress.completedLessons} of {courseProgress.totalLessons} lessons completed
                </div>
              </div>
            </div>
            <div className="text-right ml-6">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ Enrolled
              </span>
              {courseProgress.isCourseCompleted && (
                <div className="mt-2">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Completed 🎉
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {course.modules && course.modules.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-[#22292F] mb-6">
                    {course.modules[activeModule].title}
                  </h2>
                  
                  {course.modules[activeModule].lessons && course.modules[activeModule].lessons.length > 0 ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#29C7C9] mb-3">
                          {course.modules[activeModule].lessons[activeLesson].title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {course.modules[activeModule].lessons[activeLesson].description}
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3">Lesson Content:</h4>
                          <p className="text-gray-700 leading-relaxed">
                            {course.modules[activeModule].lessons[activeLesson].content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Duration: {course.modules[activeModule].lessons[activeLesson].duration} minutes
                          </div>
                          <button
                            onClick={() => markLessonComplete(activeModule, activeLesson)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              course.modules[activeModule].lessons[activeLesson].isCompleted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-[#29C7C9] text-white hover:bg-[#22b3b5]'
                            }`}
                          >
                            {course.modules[activeModule].lessons[activeLesson].isCompleted ? '✓ Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between">
                        <button
                          onClick={() => {
                            if (activeLesson > 0) {
                              setActiveLesson(activeLesson - 1);
                            } else if (activeModule > 0) {
                              setActiveModule(activeModule - 1);
                              setActiveLesson(course.modules[activeModule - 1].lessons.length - 1);
                            }
                          }}
                          disabled={activeModule === 0 && activeLesson === 0}
                          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Previous
                        </button>
                        <button
                          onClick={() => {
                            if (activeLesson < course.modules[activeModule].lessons.length - 1) {
                              setActiveLesson(activeLesson + 1);
                            } else if (activeModule < course.modules.length - 1) {
                              setActiveModule(activeModule + 1);
                              setActiveLesson(0);
                            }
                          }}
                          disabled={activeModule === course.modules.length - 1 && activeLesson === course.modules[activeModule].lessons.length - 1}
                          className="px-6 py-2 bg-[#29C7C9] text-white rounded-lg font-medium hover:bg-[#22b3b5] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📚</div>
                      <p className="text-gray-500">No lessons available in this module yet.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-gray-500">Course content is being prepared. Check back soon!</p>
                </div>
              )}
            </div>
          </div>

          {/* Course Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-[#22292F] mb-4">Course Modules</h3>
              
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border rounded-lg">
                      <button
                        onClick={() => {
                          setActiveModule(moduleIndex);
                          setActiveLesson(0);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          activeModule === moduleIndex
                            ? 'bg-[#29C7C9] text-white'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{module.title}</div>
                        <div className={`text-sm ${activeModule === moduleIndex ? 'text-blue-100' : 'text-gray-500'}`}>
                          {module.lessons?.length || 0} lessons
                        </div>
                      </button>
                      
                      {activeModule === moduleIndex && module.lessons && (
                        <div className="p-3 pt-0">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lessonIndex}
                              onClick={() => setActiveLesson(lessonIndex)}
                              className={`w-full text-left p-2 rounded text-sm transition ${
                                activeLesson === lessonIndex
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {lesson.isCompleted ? (
                                  <span className="text-green-500">✓</span>
                                ) : (
                                  <span className="text-gray-400">○</span>
                                )}
                                {lesson.title}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No modules available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 