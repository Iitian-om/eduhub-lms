"use client";


import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../utils/api";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses/enrolled/courses`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setEnrolledCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const courseProgressData = [
    { name: "Completed", value: 70 },
    { name: "Remaining", value: 30 },
  ];

  const COLORS = ["#0284c7", "#e5e7eb"];

  return (
    <div className="min-h-[80vh] py-8 px-4 bg-[#F7F9FA]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-4xl font-bold text-sky-700 mb-2">
            Welcome back, <span className="text-[#29C7C9]">{user.name}</span>!
          </h1>
          <p className="text-gray-600 mb-4">
            Here's your personalized dashboard. Track your courses, progress, and explore new learning opportunities!
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/courses" className="bg-[#29C7C9] text-white px-4 py-2 rounded shadow hover:bg-[#22b3b5] transition">
              Browse Courses
            </Link>
            <Link href="/profile" className="bg-white border border-[#29C7C9] text-[#29C7C9] px-4 py-2 rounded shadow hover:bg-[#e0f7f7] transition">
              View Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-semibold text-sky-700">🎓 Enrolled Courses</h2>
            <p className="text-2xl mt-2 font-bold text-gray-800">{enrolledCourses.length}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-semibold text-sky-700">📄 Pending Assignments</h2>
            <p className="text-2xl mt-2 font-bold text-gray-800">2</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-semibold text-sky-700">✅ Profile Completion</h2>
            <p className="text-2xl mt-2 font-bold text-gray-800">80%</p>
          </div>
        </div>

        {/* Weekly Study Goal */}
        <div>
          <h2 className="text-2xl font-bold text-sky-700 mb-2">🎯 Weekly Study Goal</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-sky-600 h-4 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="mt-1 text-sm text-gray-600">3/5 hours completed this week</p>
        </div>

        {/* Course Completion Chart */}
        <div>
          <h2 className="text-2xl font-bold text-sky-700 mb-4">📈 Course Completion</h2>
          <div className="h-64 w-full md:w-1/3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseProgressData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {courseProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Your Enrolled Courses */}
        <div>
          <h2 className="text-2xl font-bold text-sky-700 mb-4">📚 Your Enrolled Courses</h2>
          {coursesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29C7C9] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your courses...</p>
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Enrolled
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
                      <span className="text-sm text-gray-500">Level: {course.level}</span>
                      <span className="text-sm text-gray-500">{course.students} students</span>
                    </div>
                    
                    <div className="mt-4">
                      <button className="w-full bg-[#29C7C9] text-white py-2 rounded-lg font-medium hover:bg-[#22b3b5] transition">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses enrolled yet</h3>
              <p className="text-gray-500 mb-4">Start your learning journey by enrolling in courses!</p>
              <Link href="/courses" className="bg-[#29C7C9] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#22b3b5] transition">
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Daily Motivation */}
        <div className="bg-sky-100 text-sky-900 border-l-4 border-sky-600 p-4 rounded-xl italic">
          💡 "Learning never exhausts the mind." – Leonardo da Vinci"
        </div>
      </div>
    </div>
  );
}