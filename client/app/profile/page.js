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
    <main className="min-h-[90vh] bg-[#F4FAFA] px-4 py-10 text-[#22313A] sm:px-6 lg:px-8">
      {/* Profile overview hero */}
      <section className="mx-auto mb-8 w-full max-w-6xl rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          {/* Profile avatar */}
          <div className="flex-shrink-0">
            {user.profile_picture ? (
              <img
                src={user.profile_picture.startsWith('http') ? user.profile_picture : `${API_BASE_URL}${user.profile_picture}`}
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-[#29C7C9] object-cover shadow"
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`h-28 w-28 rounded-full border-4 border-[#29C7C9] bg-[#29C7C9] text-white shadow flex items-center justify-center text-4xl font-bold ${user.profile_picture ? 'hidden' : ''}`}>
              {user.name.charAt(0)}
            </div>
          </div>

          {/* Profile identity and actions */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-[#1B2A33]">{user.name}</h1>
              <span className="text-lg text-[#5B7480]">@{user.userName}</span>
            </div>
            <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-[#178E90] border border-[#BFE9EA]">{user.role}</span>
            <p className="mt-2 text-sm text-[#415E6B]">{user.email}</p>
            {user.location && <p className="mt-1 text-sm text-[#415E6B]">Location: {user.location}</p>}
            <p className="mt-3 max-w-2xl text-sm text-[#4A6572]">{user.bio || <span className="italic text-[#8197A1]">No bio provided yet.</span>}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/profile/edit" className="rounded-full bg-[#29C7C9] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#22b6b7]">
                Edit Profile
              </Link>
              <Link href="/dashboard" className="rounded-full border border-[#29C7C9] bg-white px-5 py-2 text-sm font-semibold text-[#178E90] transition hover:bg-[#E7F8F8]">
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolled courses section */}
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-[#D7ECEE] bg-white p-8 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#1B2A33]">Enrolled Courses ({enrolledCourses.length})</h2>
          <div className="rounded-full border border-[#D9EFF0] bg-[#F6FCFC] px-3 py-1 text-sm text-[#46606D]">
            Completed: {user.Courses_Completed?.length || 0}
          </div>
        </div>

        {coursesLoading ? (
          // Loading state
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29C7C9] mx-auto"></div>
            <p className="mt-2 text-[#4A6572]">Loading your courses...</p>
          </div>
        ) : enrolledCourses.length > 0 ? (
          // Courses grid
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="rounded-xl border border-[#D8ECEE] bg-[#F8FEFE] p-5 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#1B2A33] text-lg">{course.title}</span>
                  <div className="flex gap-1">
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Enrolled</span>
                    {user.Courses_Completed?.includes(course._id) && (
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Completed</span>
                    )}
                  </div>
                </div>
                <p className="text-[#4A6572] text-sm mb-2 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-[#6A808A]">
                  <span>Instructor: {course.instructor}</span>
                  <span>Duration: {course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6A808A] mt-1">
                  <span>Level: {course.level}</span>
                  <span>Category: {course.category}</span>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={() => router.push(`/coursePage/${course._id}`)}
                    className="w-full rounded-full bg-[#29C7C9] text-white py-2 font-medium hover:bg-[#22b3b5] transition text-sm"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-[#6A808A] mb-4">You are not enrolled in any courses yet.</p>
            <Link href="/courses" className="rounded-full bg-[#29C7C9] text-white px-6 py-3 font-medium hover:bg-[#22b3b5] transition">
              Browse Courses
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}