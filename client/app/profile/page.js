"use client";

// client/app/profile/page.js

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
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow relative">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.role}
        </div>
        <div>
          <span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString() }
        </div>
      </div>
      <Link href="/dashboard" className="block mt-6 text-blue-600 hover:underline">
        Go to Dashboard
      </Link>
      {/* Logout button at bottom-right */}
      <button
        onClick={handleLogout}
        className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow"
      >
        Logout
      </button>
    </div>
  );
}