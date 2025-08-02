"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext"; // ✅ using the custom hook
import AdminSidebar from "../components/AdminSidebar";
import AdminStats from "../components/AdminStats";
import AdminRecentActivity from "../components/AdminRecentActivity";

// ✅ force dynamic rendering to avoid Vercel prerender errors
export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const { user } = useUser(); // ✅ cleaner than useContext(UserContext)
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalContent: 0,
    recentUsers: [],
    recentCourses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "Admin") {
      router.push("/login");
      return;
    }

    fetchAdminStats();
  }, [user, router]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stats`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#29C7C9]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Here's what's happening on EduHub.
          </p>
        </div>

        <AdminStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <AdminRecentActivity title="Recent Users" data={stats.recentUsers} type="users" />
          <AdminRecentActivity title="Recent Courses" data={stats.recentCourses} type="courses" />
        </div>
      </div>
    </div>
  );
}
