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
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29C7C9] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#22292F] mb-4">
            Explore Our <span className="text-[#29C7C9]">Courses</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of courses designed to help you learn and grow. 
            From programming to data science, we have something for everyone.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9]"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? "bg-[#29C7C9] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#29C7C9] text-white px-2 py-1 rounded text-sm font-medium">
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
                
                <h3 className="text-xl font-bold text-[#22292F] mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>👨‍🏫 {course.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>⏱️ {course.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#29C7C9]">{course.price}</span>
                  <span className="text-sm text-gray-500">{course.students} students</span>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleEnroll(course)}
                    disabled={enrollingCourse === course._id}
                    className="flex-1 bg-[#29C7C9] text-white py-2 rounded-lg font-medium hover:bg-[#22b3b5] transition disabled:opacity-50"
                  >
                    {enrollingCourse === course._id ? "Enrolling..." : (user ? "Enroll Now" : "Login to Enroll")}
                  </button>
                  <button 
                    onClick={() => handlePreview(course)}
                    className="px-4 py-2 border border-[#29C7C9] text-[#29C7C9] rounded-lg hover:bg-[#e0f7f7] transition"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && previewCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-[#22292F]">{previewCourse.title}</h2>
                <button
                  onClick={closePreviewModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
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
                  <p className="text-gray-600 mb-4">{previewCourse.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-medium">{previewCourse.instructor}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{previewCourse.duration}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium">{previewCourse.level}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="font-medium">{previewCourse.students}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Course Requirements</h3>
                    <ul className="space-y-1">
                      {previewCourse.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600">• {req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Course Syllabus</h3>
                    <ol className="space-y-1">
                      {previewCourse.syllabus.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600">{index + 1}. {item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleEnroll(previewCourse)}
                  disabled={enrollingCourse === previewCourse._id}
                  className="flex-1 bg-[#29C7C9] text-white py-3 rounded-lg font-medium hover:bg-[#22b3b5] transition disabled:opacity-50"
                >
                  {enrollingCourse === previewCourse._id ? "Enrolling..." : (user ? "Enroll Now" : "Login to Enroll")}
                </button>
                <button
                  onClick={closePreviewModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 