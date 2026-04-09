"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../utils/api";

export default function PublicProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { userName } = useParams();
  const [profile, setProfile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !userName) return;

    const fetchProfile = async () => {
      setFetching(true);
      setNotFound(false);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/profiles/${userName}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (response.status === 404) {
          setNotFound(true);
          setProfile(null);
          return;
        }

        if (data.success) {
          setProfile(data.user);
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user, userName]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  if (fetching) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-600">Loading profile...</div>;
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-[#22292F]">Profile not found</h1>
        <Link href="/profiles" className="mt-4 text-[#29C7C9] font-medium">
          ← Back to profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-[#F7F9FA] px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <Link href="/profiles" className="text-sm text-[#29C7C9] font-medium">
          ← Back to profiles
        </Link>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mt-4">
          {profile.profile_picture ? (
            <img src={profile.profile_picture} alt={profile.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#29C7C9]" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#29C7C9] text-white flex items-center justify-center text-4xl font-bold">
              {profile.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#22292F]">{profile.name}</h1>
            <p className="text-gray-500 text-lg">@{profile.userName}</p>
            <span className="inline-block mt-2 text-xs bg-[#E6F7F8] text-[#29C7C9] px-3 py-1 rounded-full">
              {profile.role}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-gray-700">{profile.bio || "No bio added yet."}</p>
          <p className="text-sm text-gray-500">{profile.location ? `📍 ${profile.location}` : "📍 Location not added"}</p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#F7F9FA] rounded-lg p-3">
            <p className="text-xl font-bold text-[#22292F]">{profile.stats?.enrolledCourses || 0}</p>
            <p className="text-xs text-gray-500">Enrolled</p>
          </div>
          <div className="bg-[#F7F9FA] rounded-lg p-3">
            <p className="text-xl font-bold text-[#22292F]">{profile.stats?.completedCourses || 0}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-[#F7F9FA] rounded-lg p-3">
            <p className="text-xl font-bold text-[#22292F]">{profile.stats?.createdCourses || 0}</p>
            <p className="text-xs text-gray-500">Created</p>
          </div>
        </div>

        <button
          disabled
          className="mt-6 w-full border border-[#29C7C9] text-[#29C7C9] py-3 rounded-lg font-semibold cursor-not-allowed opacity-60"
          title="Connect feature coming soon"
        >
          Connect (Coming Soon)
        </button>
      </div>
    </div>
  );
}
