"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../utils/api";

export default function DashboardPage() {
  const { user, loading } = useUser();      // Get user data and loading state from context
  const router = useRouter();               // Next.js router for navigation
  const [enrolledCourses, setEnrolledCourses] = useState([]);   // State to hold enrolled courses
  const [coursesLoading, setCoursesLoading] = useState(true);   // State to track loading status of courses

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

  // BUG: Maybe there is a problem here.
  // from line 22 to line 46 
  // writing useEffect to fetch enrolled courses for the user but 
  // fetchEnrolledCourses is defined after the calling useEffect, so is it why this route takes a lot time to lod??

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

  if (loading) return
        <div className="min-h-screen flex items-center justify-center bg-[#F4FAFA]">
          Loading...
        </div>;
  if (!user) return null;

  // const courseProgressData = [
  //   { name: "Completed", value: 70 },
  //   { name: "Remaining", value: 30 },
  // ];

  // const COLORS = ["#29C7C9", "#D7ECEE"];

  return (
    <div className="min-h-screen py-12 px-4 bg-[#F4FAFA]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Hero Section */}
        <section className="mx-auto rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B2A33] mb-2">
                Welcome back, <span className="text-[#29C7C9]">{user.name}</span>!
              </h1>
              <p className="text-[#4A6572] text-lg mb-6">
                Track progress, explore resources, and continue your learning journey here.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/courses" className="btn btn-lg md:btn-lg bg-[#29C7C9] hover:bg-[#178E90] text-white border-none rounded-full px-8 shadow-sm">
                  📚 Browse Courses
                </Link>
                <Link href="/profile" className="btn btn-lg md:btn-lg border-[#29C7C9] text-[#29C7C9] bg-white hover:bg-[#EAF8F8] rounded-full px-8 shadow-sm">
                  👤 View Profile
                </Link>
                {(user.role === "Admin" || user.role === "Instructor" || user.role === "Mod") && (
                  <>
                    <Link href="/create-course" className="btn btn-lg md:btn-lg bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-full px-8 shadow-sm">
                      ➕ Create Course
                    </Link>
                    <Link href="/upload-book" className="btn btn-lg md:btn-lg bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-full px-8 shadow-sm">
                      📖 Upload Book
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="stats bg-white border-2 border-[#D7ECEE] shadow-md hover:shadow-lg transition-all">
            <div className="stat py-6 px-4">
              <div className="stat-title text-[#4A6572] text-sm font-semibold uppercase tracking-wide">Enrolled Courses</div>
              <div className="stat-value text-[#29C7C9] text-4xl">{enrolledCourses.length}</div>
              <div className="stat-desc text-[#6A808A] text-sm mt-1">Active courses</div>
            </div>
          </div>
          <div className="stats bg-white border-2 border-[#D7ECEE] shadow-md hover:shadow-lg transition-all">
            <div className="stat py-6 px-4">
              <div className="stat-title text-[#4A6572] text-sm font-semibold uppercase tracking-wide">Completed</div>
              <div className="stat-value text-emerald-600 text-4xl">{user.Courses_Completed?.length || 0}</div>
              <div className="stat-desc text-[#6A808A] text-sm mt-1">Finished courses</div>
            </div>
          </div>
          <div className="stats bg-white border-2 border-[#D7ECEE] shadow-md hover:shadow-lg transition-all">
            <div className="stat py-6 px-4">
              <div className="stat-title text-[#4A6572] text-sm font-semibold uppercase tracking-wide">In Progress</div>
              <div className="stat-value text-blue-600 text-4xl">{Math.max(0, enrolledCourses.length - (user.Courses_Completed?.length || 0))}</div>
              <div className="stat-desc text-[#6A808A] text-sm mt-1">Keep going!</div>
            </div>
          </div>
          <div className="stats bg-white border-2 border-[#D7ECEE] shadow-md hover:shadow-lg transition-all">
            <div className="stat py-6 px-4">
              <div className="stat-title text-[#4A6572] text-sm font-semibold uppercase tracking-wide">Profile</div>
              <div className="stat-value text-indigo-600 text-4xl">80%</div>
              <div className="stat-desc text-[#6A808A] text-sm mt-1">Complete your profile</div>
            </div>
          </div>
        </div>

        {/* Weekly Study Goal */}
        {/* <section className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33] mb-4">🎯 Weekly Study Goal</h2>
          <div className="progress progress-success w-full h-3" value="60" max="100"></div>
          <p className="text-sm text-[#4A6572] mt-3">3/5 hours completed this week</p>
        </section> */}

        {/* Course Completion Chart */}
        {/* <section className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33] mb-6">📈 Course Completion Progress</h2>
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
        </section> */}

        {/* Your Enrolled Courses Section */}
        <section className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33] mb-6">📚 Your Enrolled Courses</h2>
          {coursesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#D7ECEE] border-t-[#29C7C9] mx-auto mb-3"></div>
              <p className="text-[#4A6572]">Loading your courses...</p>
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <div key={course._id} className="card bg-[#F4FAFA] border border-[#D7ECEE] shadow-md hover:shadow-lg transition-all">
                  <figure className="relative h-48">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="badge badge-success gap-2 bg-emerald-600 border-none text-white">
                        ✓ Enrolled
                      </div>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-sm bg-[#EAF8F8] text-[#29C7C9] border-none font-medium">{course.category}</span>
                      <div className="flex items-center text-yellow-500 text-sm font-semibold">
                        {course.rating} <span className="ml-1">★</span>
                      </div>
                    </div>
                    <h3 className="card-title text-[#1B2A33] text-lg line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-[#4A6572] line-clamp-2">{course.description}</p>
                    <div className="text-xs text-[#6A808A] space-y-1 my-2">
                      <p>👨‍🏫 {course.instructor}</p>
                      <p>⏱️ {course.duration} • Level: {course.level}</p>
                      <p>👥 {course.students} students</p>
                    </div>
                    <div className="card-actions justify-stretch mt-4">
                      <Link
                        href={`/coursePage/${course._id}`}
                        className="btn btn-md w-full bg-[#29C7C9] hover:bg-[#178E90] text-white border-none rounded-lg"
                      >
                        Continue Learning →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-[#1B2A33] mb-2">No courses enrolled yet</h3>
              <p className="text-[#4A6572] mb-6">Start your learning journey by exploring our course catalog.</p>
              <Link href="/courses" className="btn btn-lg bg-[#29C7C9] hover:bg-[#178E90] text-white border-none rounded-full px-8 shadow-sm">
                Explore Courses
              </Link>
            </div>
          )}
        </section>

        {/* Motivation Banner */}
        <div className="alert alert-info bg-[#EAF8F8] border border-[#CFE9EA] shadow-sm">
          <div>
            <span className="text-lg">💡</span>
            <span className="text-[#1B2A33] font-medium">"Learning never exhausts the mind." – Leonardo da Vinci</span>
          </div>
        </div>
      </div>
    </div>
  );
}