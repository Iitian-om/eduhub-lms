"use client";

// Import 
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";

export default function ProfilePage() {
  const { user, setUser, loading } = useUser();
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

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch {
      toast.error("Logout failed!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-[90vh] bg-[#F7F9FA] flex flex-col items-center px-2 py-4">
      {/* Upper Profile Div */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row items-center gap-8 mb-10 profile-div">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {user.profile_picture ? (
            <img
              src={user.profile_picture.startsWith('http') ? user.profile_picture : `${API_BASE_URL}${user.profile_picture}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#29C7C9] shadow"
              onError={(e) => {
                console.log("Image failed to load:", e.target.src);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-28 h-28 rounded-full bg-[#29C7C9] flex items-center justify-center text-white text-4xl font-bold border-4 border-[#29C7C9] shadow ${user.profile_picture ? 'hidden' : ''}`}>
            {user.name.charAt(0)}
          </div>
        </div>
        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-2xl font-bold text-[#22292F]">{user.name}</span>
            <span className="text-gray-500 text-lg">- @{user.userName}</span>
          </div>
          <span className="inline-block bg-[#E6F7F8] text-[#29C7C9] px-3 py-1 rounded-full text-xs font-semibold mt-1 mb-1 capitalize w-fit">{user.role}</span>
          <span className="text-gray-700 text-sm mb-1">{user.email}</span>
          <p className="text-gray-600 text-sm mb-2 max-w-xl break-words">{user.bio || <span className="italic text-gray-400">No bio provided.</span>}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/profile/edit" className="bg-[#29C7C9] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#22b6b7] transition">
              Edit Profile
            </Link>
            <Link href="/dashboard" className="bg-[#F7D774] text-[#22292F] px-5 py-2 rounded-lg font-semibold hover:bg-[#ffe9a7] transition border border-[#f7d774]">Go to Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Enrolled Courses Div */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow p-8 mt-2">
        <h3 className="text-xl font-bold text-[#29C7C9] mb-4">Enrolled Courses ({enrolledCourses.length})</h3>
        {coursesLoading ? (
          // Loading animation while loading the coureses
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29C7C9] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your courses...</p>
          </div>
        ) : enrolledCourses.length > 0 ? ( 
          // Display enrolled courses
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="bg-[#E6F7F8] rounded-lg p-4 shadow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#22292F] text-lg">{course.title}</span>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Enrolled</span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>👨‍🏫 {course.instructor}</span>
                  <span>⏱️ {course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>Level: {course.level}</span>
                  <span>Category: {course.category}</span>
                </div>
                <div className="mt-3">
                  <button className="w-full bg-[#29C7C9] text-white py-2 rounded-lg font-medium hover:bg-[#22b3b5] transition text-sm">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : ( // No courses enrolled in message
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-500 mb-4">You are not enrolled in any courses yet.</p>
            <Link href="/courses" className="bg-[#29C7C9] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#22b3b5] transition">
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}