"use client";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p className="mb-2">This is your dashboard. Here you can see your enrolled courses, progress, and more features coming soon!</p>
    </div>
  );
}