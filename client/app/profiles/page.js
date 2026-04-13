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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F4FAFA]">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4FAFA] px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profiles Hero Section */}
        <section className="rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B2A33] mb-2">Learn in Public</h1>
          <p className="text-lg text-[#4A6572] mb-6">
            Discover students, instructors, and educators in the EduHub community. Connect, collaborate, and grow together.
          </p>
        </section>

        {/* Search & Filter Form */}
        <form onSubmit={onSearchSubmit} className="bg-white rounded-2xl border border-[#D7ECEE] shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="🔍 Search by name or username"
              className="input input-bordered flex-1 bg-[#F4FAFA] border-[#D7ECEE] text-[#1B2A33] focus:outline-none focus:border-[#29C7C9] focus:ring-2 focus:ring-[#29C7C9] focus:ring-opacity-20"
            />
            <select
              value={role}
              onChange={onRoleChange}
              className="select select-bordered bg-[#F4FAFA] border-[#D7ECEE] text-[#1B2A33] focus:outline-none focus:border-[#29C7C9]"
            >
              <option value="all">All roles</option>
              <option value="User">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Mod">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" className="btn bg-[#29C7C9] hover:bg-[#178E90] text-white border-none rounded-full w-full md:w-auto">
              Search
            </button>
          </div>
        </form>

        {/* Loading State */}
      {fetching ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#D7ECEE] border-t-[#29C7C9] mx-auto mb-3"></div>
          <p className="text-[#4A6572]">Discovering profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D7ECEE] shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-[#4A6572] text-lg">No profiles found matching your search.</p>
        </div>
      ) : (
        <>
          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile._id} className="card bg-white border border-[#D7ECEE] shadow-md hover:shadow-lg hover:border-[#29C7C9] transition-all">
                <div className="card-body">
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4 pb-4 border-b border-[#D7ECEE]">
                    {profile.profile_picture ? (
                      <img src={profile.profile_picture} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#29C7C9]" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#29C7C9] to-[#178E90] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        {profile.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1B2A33] text-lg">{profile.name}</h3>
                      <p className="text-sm text-[#4A6572]">@{profile.userName}</p>
                      <div className="mt-2">
                        <span className={`badge gap-2 border-none font-medium
                            ${profile.role === 'Admin' ? 'bg-red-100 text-red-700' :
                            profile.role === 'Instructor' ? 'bg-indigo-100 text-indigo-700' :
                              profile.role === 'Mod' ? 'bg-amber-100 text-amber-700' :
                                'bg-[#EAF8F8] text-[#29C7C9]'
                          }
                          `}>
                          {profile.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <p className="text-sm text-[#4A6572] min-h-12 mb-3">{profile.bio || "No bio added yet."}</p>

                  {profile.location && (
                    <p className="text-xs text-[#6A808A]">📍 {profile.location}</p>
                  )}

                  {/* Stats */}
                  <div className="divider my-3"></div>
                  <div className="stats stats-vertical w-full bg-[#F4FAFA] border border-[#D7ECEE]">
                    <div className="stat">
                      <div className="stat-title text-[#4A6572] text-xs">Enrolled</div>
                      <div className="stat-value text-[#29C7C9] text-lg">{profile.stats?.enrolledCourses || 0}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title text-[#4A6572] text-xs">Completed</div>
                      <div className="stat-value text-emerald-600 text-lg">{profile.stats?.completedCourses || 0}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-stretch mt-4 gap-2">
                    <Link href={`/profiles/${profile.userName}`} className="btn btn-sm flex-1 bg-[#29C7C9] hover:bg-[#178E90] text-white border-none rounded-lg">
                      View Profile
                    </Link>
                    <button
                      disabled
                      className="btn btn-sm flex-1 border border-[#D7ECEE] text-[#4A6572] cursor-not-allowed opacity-60 rounded-lg"
                      title="Connect feature coming soon"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-sm btn-outline border-[#29C7C9] text-[#29C7C9] hover:bg-[#EAF8F8] disabled:opacity-50"
              >
                ← Previous
              </button>
              <div className="join">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`join-item btn btn-xs ${page === pageNum ? 'btn-active bg-[#29C7C9] border-[#29C7C9]' : 'border-[#D7ECEE] hover:border-[#29C7C9]'}`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-sm btn-outline border-[#29C7C9] text-[#29C7C9] hover:bg-[#EAF8F8] disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
