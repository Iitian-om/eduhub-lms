"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../utils/api";

export default function PublicProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const userName = (params?.userName || "").toString();

  const [profile, setProfile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !userName) return;

    const fetchProfile = async () => {
      setFetching(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/profiles/${encodeURIComponent(userName)}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          setProfile(null);
          setError(data.message || "Profile not found");
        } else {
          setProfile(data.user || null);
        }
      } catch {
        setProfile(null);
        setError("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user, userName]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-[90vh] bg-[#F7F9FA] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/profiles" className="text-sm text-[#29C7C9] hover:underline">
            Back to profiles
          </Link>
        </div>

        {fetching ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-600">Loading profile...</div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            {error}
          </div>
        ) : !profile ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Profile not found.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#29C7C9]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#29C7C9] text-white flex items-center justify-center text-3xl font-bold">
                  {profile.name?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-[#22292F]">{profile.name}</h1>
                <p className="text-gray-500">@{profile.userName}</p>
                <span className="inline-block text-xs bg-[#E6F7F8] text-[#29C7C9] mt-1 px-2 py-1 rounded-full">
                  {profile.role}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-gray-700">
              <p>{profile.bio || "No bio added yet."}</p>
              <p>{profile.location ? `Location: ${profile.location}` : "Location not added"}</p>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-[#F7F9FA] rounded-lg p-3">
                <p className="text-gray-500">Enrolled</p>
                <p className="text-lg font-semibold text-[#22292F]">{profile.stats?.enrolledCourses || 0}</p>
              </div>
              <div className="bg-[#F7F9FA] rounded-lg p-3">
                <p className="text-gray-500">Completed</p>
                <p className="text-lg font-semibold text-[#22292F]">{profile.stats?.completedCourses || 0}</p>
              </div>
              <div className="bg-[#F7F9FA] rounded-lg p-3">
                <p className="text-gray-500">Created</p>
                <p className="text-lg font-semibold text-[#22292F]">{profile.stats?.createdCourses || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}