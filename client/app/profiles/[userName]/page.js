"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../utils/api";

export default function ProfilesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "12");
    if (search) params.set("search", search);
    if (role !== "all") params.set("role", role);
    return params.toString();
  }, [page, search, role]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const fetchProfiles = async () => {
      setFetching(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/profiles?${queryString}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setProfiles(data.users || []);
          setTotalPages(data.pagination?.totalPages || 1);
        } else {
          setProfiles([]);
          setTotalPages(1);
        }
      } catch {
        setProfiles([]);
        setTotalPages(1);
      } finally {
        setFetching(false);
      }
    };

    fetchProfiles();
  }, [user, queryString]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const onRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-[90vh] bg-[#F7F9FA] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#22292F]">Learn in Public</h1>
          <p className="text-gray-600 mt-1">Discover students, instructors and admins in EduHub.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <form onSubmit={onSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or username"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9]"
            />
            <select
              value={role}
              onChange={onRoleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9]"
            >
              <option value="all">All roles</option>
              <option value="User">User</option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" className="bg-[#29C7C9] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#22b6b7]">
              Search
            </button>
          </form>
        </div>

        {fetching ? (
          <div className="text-center text-gray-600 py-10">Loading profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            No profiles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <div key={profile._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  {profile.profile_picture ? (
                    <img src={profile.profile_picture} alt={profile.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#29C7C9]" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#29C7C9] text-white flex items-center justify-center text-xl font-bold">
                      {profile.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-[#22292F]">{profile.name}</h3>
                    <p className="text-sm text-gray-500">@{profile.userName}</p>
                    <span className="inline-block text-xs bg-[#E6F7F8] text-[#29C7C9] mt-1 px-2 py-1 rounded-full">{profile.role}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 min-h-10">{profile.bio || "No bio added yet."}</p>
                <p className="text-xs text-gray-500 mt-2">{profile.location ? `📍 ${profile.location}` : "📍 Location not added"}</p>
                <div className="mt-3 text-xs text-gray-600 flex gap-3">
                  <span>Enrolled: {profile.stats?.enrolledCourses || 0}</span>
                  <span>Done: {profile.stats?.completedCourses || 0}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/profiles/${profile.userName}`} className="flex-1 text-center bg-[#29C7C9] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#22b6b7]">
                    View Profile
                  </Link>
                  <button
                    disabled
                    className="flex-1 border border-[#29C7C9] text-[#29C7C9] py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-60"
                    title="Connect feature coming soon"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded border border-gray-300 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded border border-gray-300 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}