"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../utils/api";

export default function MaintainencePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [overview, setOverview] = useState(null);
  const [notes, setNotes] = useState([]);
  const [books, setBooks] = useState([]);
  const [papers, setPapers] = useState([]);
  const [tab, setTab] = useState("notes");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Login Test
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // Authorization Test
    if (!loading && user && user.role !== "Admin" && user.role !== "Mod") {
      alert("You are Unauthorized for Accessing this. Redirecting to dashboard.");
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  // Fetch content review data
  const fetchData = async () => {
    setFetching(true);
    setError("");

    // Fetch overview stats and content lists in parallel
    try {
      const [overviewRes, notesRes, booksRes, papersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/mod/overview`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/v1/mod/notes`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/v1/mod/books`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/v1/mod/papers`, { credentials: "include" }),
      ]);

      if (!overviewRes.ok || !notesRes.ok || !booksRes.ok || !papersRes.ok) {
        throw new Error("Failed to load content review data");
      }

      const [overviewData, notesData, booksData, papersData] = await Promise.all([
        overviewRes.json(),
        notesRes.json(),
        booksRes.json(),
        papersRes.json(),
      ]);

      setOverview(overviewData.overview || null);
      setNotes(notesData.notes || []);
      setBooks(booksData.books || []);
      setPapers(papersData.papers || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load content review data");
    } finally {
      setFetching(false);
    }
  };

  // Fetch data on component mount if user is admin or mod
  useEffect(() => {
    if (user && (user.role === "Admin" || user.role === "Mod")) {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (type, id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/mod/${type}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type.slice(0, -1)}`);
      }

      if (type === "notes") setNotes((prev) => prev.filter((item) => item._id !== id));
      if (type === "books") setBooks((prev) => prev.filter((item) => item._id !== id));
      if (type === "papers") setPapers((prev) => prev.filter((item) => item._id !== id));
    } catch (deleteError) {
      setError(deleteError.message || "Delete failed");
    }
  };

  const activeList = useMemo(() => {
    if (tab === "notes") return notes;
    if (tab === "books") return books;
    return papers;
  }, [tab, notes, books, papers]);

  if (loading || fetching) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F4FAFA]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D7ECEE] border-t-[#29C7C9] mx-auto mb-3"></div>
        <p className="text-[#4A6572]">Loading content review workspace...</p>
      </div>
    </div>;
  }

  if (!user || (user.role !== "Admin" && user.role !== "Mod")) {
    alert("You are Unauthorized for Accessing this. Redirecting to dashboard.");
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4FAFA] px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Content Review Hero Section */}
        <section className="rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B2A33] mb-2">Content Review Workspace</h1>
          <p className="text-lg text-[#4A6572]">
            Administrative panel for monitoring and reviewing user-generated content across the platform.
          </p>
          <div className="mt-4">
            <span className={`badge gap-2 font-semibold ${user?.role === 'Admin' ? 'bg-red-100 rounded-full text-red-700 py-1 px-1' : 'py-1 px-1 rounded-full bg-amber-100 text-amber-700'}`}>
              {user?.role === 'Admin' ? '🔴 Full Admin Access' : '🟡 Moderator Access'}
            </span>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error bg-red-100 border border-red-400 text-red-900 shadow">
            <div>
              <span>⚠️ {error}</span>
            </div>
          </div>
        )}

        {/* Platform Overview Stats
        {overview && (
          <div>
            <h2 className="text-2xl font-bold text-[#1B2A33] mb-4">📊 Platform Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard title="Total Users" value={overview.totalUsers} icon="👥" />
              <StatCard title="Courses" value={overview.totalCourses} icon="📚" />
              <StatCard title="Total Content" value={overview.totalContent} icon="📄" />
              <StatCard title="Notes" value={overview.totalNotes} icon="📓" />
              <StatCard title="Books & Papers" value={(overview.totalBooks || 0) + (overview.totalPapers || 0)} icon="📖" />
            </div>
          </div>
        )} */}

{/* Platform Overview Stats */}
{overview && (
  <div className="px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl font-bold text-[#1B2A33] mb-4">
      📊 Platform Overview
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard title="Total Users" value={overview.totalUsers} icon="👥" />
      <StatCard title="Courses" value={overview.totalCourses} icon="📚" />
      <StatCard title="Total Content" value={overview.totalContent} icon="📄" />
      <StatCard title="Notes" value={overview.totalNotes} icon="📓" />
      <StatCard
        title="Books & Papers"
        value={(overview.totalBooks || 0) + (overview.totalPapers || 0)}
        icon="📖"
      />
    </div>
  </div>
)}


        {/* Content Review Tabs */}
        <section className="rounded-2xl border border-[#D7ECEE] bg-white shadow-md overflow-hidden">
          <div className="tabs tabs-bordered tabs-lg bg-[#F4FAFA] p-4">
            {[
              ["notes", `📝 Notes (${notes.length})`, "Notes"],
              ["books", `📖 Books (${books.length})`, "Books"],
              ["papers", `📰 Papers (${papers.length})`, "Research Papers"],
            ].map(([id, label, title]) => (
              <input
                key={id}
                type="radio"
                name="content-tabs"
                className="tab"
                label={label}
                aria-label={label}
                checked={tab === id}
                onChange={() => setTab(id)}
              />
            ))}
          </div>

          {/* Content List */}
          <div className="p-6">
            {activeList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-[#4A6572] text-lg">No items in this section</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeList.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-4 p-4 border border-[#D7ECEE] rounded-lg hover:border-[#29C7C9] transition-all bg-[#F4FAFA] hover:bg-white">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1B2A33] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#4A6572]">
                        👤 {item.uploadedBy?.name || "Unknown"} • 📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                      </p>
                      {item.description && (
                        <p className="text-xs text-[#6A808A] mt-1 line-clamp-1">{item.description}</p>
                      )}
                    </div>

                    {user.role === "Admin" ? (
                      <button
                        onClick={() => {
                          if (confirm(`Remove this ${tab.slice(0, -1)}?`)) {
                            handleDelete(tab, item._id);
                          }
                        }}
                        className="btn btn-sm btn-error bg-red-600 hover:bg-red-700 text-white border-none rounded-lg whitespace-nowrap"
                      >
                        🗑️ Remove
                      </button>
                    ) : (
                      <span className="badge badge-lg bg-amber-100 text-amber-700 border-none">
                        View Only
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stats shadow bg-[#F4FAFA] border border-[#D7ECEE]">
      <div className="stat">
        <div className="stat-title text-[#4A6572]">{title}</div>
        <div className="stat-value text-[#29C7C9]">{value ?? 0}</div>
        <div className="stat-desc text-[#6A808A]">{icon}</div>
      </div>
    </div>
  );
}