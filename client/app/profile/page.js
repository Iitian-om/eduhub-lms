"use client";

// Import 
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
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
    <div className="min-h-[90vh] bg-[#F7F9FA] flex flex-col items-center px-2 py-8">
      {/* Upper Profile Div */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row items-center gap-8 mb-10 profile-div">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {user.profile_picture ? (
            <img
              src={user.profile_picture.startsWith('http') ? user.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}`}
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
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8 mt-2">
        <h3 className="text-xl font-bold text-[#29C7C9] mb-4">Enrolled Courses</h3>
        {user.Courses_Enrolled_In && user.Courses_Enrolled_In.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.Courses_Enrolled_In.map((course, idx) => (
              <li key={course._id || idx} className="bg-[#E6F7F8] rounded-lg p-4 shadow flex flex-col">
                <span className="font-semibold text-[#22292F] text-lg">{course.title || "Untitled Course"}</span>
                {course.instructor && (
                  <span className="text-xs text-gray-500 mt-1">Instructor: {course.instructor.name || course.instructor}</span>
                )}
                {/* Add more course info if available */}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 italic">You are not enrolled in any courses yet.</div>
        )}
      </div>
    </div>
  );
}