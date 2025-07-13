"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DebugPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F7F9FA] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[#22292F] mb-8">Debug Information</h1>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-[#29C7C9] mb-4">Current User Data</h2>

                    <div className="space-y-4">
                        <div>
                            <strong>Name:</strong> {user.name}
                        </div>
                        <div>
                            <strong>Username:</strong> {user.userName}
                        </div>
                        <div>
                            <strong>Email:</strong> {user.email}
                        </div>
                        <div>
                            <strong>Role:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{user.role}</span>
                        </div>
                        <div>
                            <strong>Location:</strong> {user.location || "Not set"}
                        </div>
                        <div>
                            <strong>Bio:</strong> {user.bio || "Not set"}
                        </div>
                        <div>
                            <strong>Phone:</strong> {user.phone || "Not set"}
                        </div>
                        <div>
                            <strong>Gender:</strong> {user.gender || "Not set"}
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">Role Check Results:</h3>
                        <div className="space-y-2 text-sm">
                            <div>Is Admin: {user.role === "Admin" ? "✅ Yes" : "❌ No"}</div>
                            <div>Is Instructor: {user.role === "Instructor" ? "✅ Yes" : "❌ No"}</div>
                            <div>Can Create Course: {(user.role === "Admin" || user.role === "Instructor") ? "✅ Yes" : "❌ No"}</div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={() => router.push("/create-course")}
                            className="bg-[#29C7C9] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#22b3b5] transition"
                        >
                            Try Create Course
                        </button>
                        <button
                            onClick={() => router.push("/profile")}
                            className="bg-[#F7D774] text-[#22292F] px-6 py-3 rounded-lg font-medium hover:bg-[#ffe9a7] transition"
                        >
                            Go to Profile
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}