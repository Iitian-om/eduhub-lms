"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../utils/api";

export default function CoursesPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewCourse, setPreviewCourse] = useState(null); // State for course preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal state for course preview
  const [enrollingCourse, setEnrollingCourse] = useState(null);

  const categories = ["all", "Programming", "Web Development", "Data Science"];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses`);
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = async (course) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    try {
      setEnrollingCourse(course._id);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/courses/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ courseId: course._id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`🎉 Successfully enrolled in "${course.title}"! Check your dashboard for course access.`);
      } else {
        alert(data.message || 'Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setEnrollingCourse(null);
    }
  };

  const handlePreview = (course) => {
    setPreviewCourse(course);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewCourse(null);
  };

  // Loading Animation
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4FAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29C7C9] mx-auto"></div>
          <p className="mt-4 text-[#4A6572]">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4FAFA] py-10 text-[#22313A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Courses hero */}
        <section className="mb-10 rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-[#1B2A33] mb-4">
            Explore Our <span className="text-[#29C7C9]">Courses</span>
          </h1>
          <p className="text-lg text-[#4A6572] max-w-2xl">
            Discover a wide range of courses designed to help you learn and grow. 
            From programming to data science, we have something for everyone.
          </p>
        </section>

        {/* Search and filter controls */}
        <section className="bg-white rounded-2xl border border-[#D7ECEE] shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#D4E8EA] px-4 py-3 focus:border-[#29C7C9] focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-[#29C7C9] text-white"
                      : "bg-[#F2FAFA] text-[#4A6572] hover:bg-[#E7F8F8]"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <article key={course._id} className="bg-white rounded-2xl border border-[#D7ECEE] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 rounded-full bg-[#29C7C9] text-white px-3 py-1 text-xs font-semibold">
                  {course.level}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#29C7C9] font-medium">{course.category}</span>
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm ml-1">★</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#1B2A33] mb-2">{course.title}</h3>
                <p className="text-[#4A6572] mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-[#6A808A]">
                    <span>Instructor: {course.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm text-[#6A808A]">
                    <span>Duration: {course.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#29C7C9]">{course.price}</span>
                  <span className="text-sm text-[#6A808A]">{course.students} students</span>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleEnroll(course)}
                    disabled={enrollingCourse === course._id}
                    className="flex-1 rounded-full bg-[#29C7C9] text-white py-2 font-medium hover:bg-[#22b3b5] transition disabled:opacity-50"
                  >
                    {enrollingCourse === course._id ? "Enrolling..." : (user ? "Enroll Now" : "Login to Enroll")}
                  </button>
                  <button 
                    onClick={() => handlePreview(course)}
                    className="px-4 py-2 border border-[#29C7C9] text-[#29C7C9] rounded-full hover:bg-[#e0f7f7] transition"
                  >
                    Preview
                  </button>
                  {user && (
                    <Link
                      href={`/coursePage/${course._id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-center"
                    >
                      View Course
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#3B5560] mb-2">No courses found</h3>
            <p className="text-[#6A808A]">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Course preview modal */}
      {showPreviewModal && previewCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#D7ECEE] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-[#1B2A33]">{previewCourse.title}</h2>
                <button
                  onClick={closePreviewModal}
                  className="text-[#5F7782] hover:text-[#3B5560] text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={previewCourse.thumbnail}
                    alt={previewCourse.title}
                    className="w-full rounded-lg mb-4"
                  />
                  <p className="text-[#4A6572] mb-4">{previewCourse.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#F7FCFC] p-3 rounded-xl">
                      <p className="text-sm text-[#6A808A]">Instructor</p>
                      <p className="font-medium">{previewCourse.instructor}</p>
                    </div>
                    <div className="bg-[#F7FCFC] p-3 rounded-xl">
                      <p className="text-sm text-[#6A808A]">Duration</p>
                      <p className="font-medium">{previewCourse.duration}</p>
                    </div>
                    <div className="bg-[#F7FCFC] p-3 rounded-xl">
                      <p className="text-sm text-[#6A808A]">Level</p>
                      <p className="font-medium">{previewCourse.level}</p>
                    </div>
                    <div className="bg-[#F7FCFC] p-3 rounded-xl">
                      <p className="text-sm text-[#6A808A]">Students</p>
                      <p className="font-medium">{previewCourse.students}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-[#F7FCFC] p-4 rounded-xl mb-4">
                    <h3 className="font-semibold mb-2">Course Requirements</h3>
                    <ul className="space-y-1">
                      {previewCourse.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-[#4A6572]">• {req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-[#F7FCFC] p-4 rounded-xl">
                    <h3 className="font-semibold mb-2">Course Syllabus</h3>
                    <ol className="space-y-1">
                      {previewCourse.syllabus.map((item, index) => (
                        <li key={index} className="text-sm text-[#4A6572]">{index + 1}. {item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleEnroll(previewCourse)}
                  disabled={enrollingCourse === previewCourse._id}
                  className="flex-1 bg-[#29C7C9] text-white py-3 rounded-full font-medium hover:bg-[#22b3b5] transition disabled:opacity-50"
                >
                  {enrollingCourse === previewCourse._id ? "Enrolling..." : (user ? "Enroll Now" : "Login to Enroll")}
                </button>
                <button
                  onClick={closePreviewModal}
                  className="px-6 py-3 border border-[#D4E8EA] text-[#3B5560] rounded-full hover:bg-[#F3FBFB] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 