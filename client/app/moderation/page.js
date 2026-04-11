"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../utils/api";

export default function ModerationPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [overview, setOverview] = useState(null);
  const [notes, setNotes] = useState([]);
  const [books, setBooks] = useState([]);
  const [papers, setPapers] = useState([]);
  const [tab, setTab] = useState("notes");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && user && user.role !== "Admin" && user.role !== "Mod") {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  const fetchData = async () => {
    setFetching(true);
    setError("");

    try {
      const [overviewRes, notesRes, booksRes, papersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/mod/overview`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/v1/mod/notes`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/v1/mod/books`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/v1/mod/papers`, { credentials: "include" }),
      ]);

      if (!overviewRes.ok || !notesRes.ok || !booksRes.ok || !papersRes.ok) {
        throw new Error("Failed to load moderation data");
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
      setError(loadError.message || "Failed to load moderation data");
    } finally {
      setFetching(false);
    }
  };

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
    return <div className="min-h-[80vh] flex items-center justify-center">Loading moderation workspace...</div>;
  }

  if (!user || (user.role !== "Admin" && user.role !== "Mod")) {
    return null;
  }

  return (
    <div className="min-h-[90vh] bg-[#F7F9FA] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#22292F]">Moderation Workspace</h1>
        <p className="text-gray-600 mt-1">Shared operational panel for Admin and Mods with reduced control scope.</p>

        {error ? <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3">{error}</div> : null}

        {overview && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Users" value={overview.totalUsers} />
            <StatCard title="Courses" value={overview.totalCourses} />
            <StatCard title="All Content" value={overview.totalContent} />
            <StatCard title="Notes" value={overview.totalNotes} />
            <StatCard title="Books + Papers" value={(overview.totalBooks || 0) + (overview.totalPapers || 0)} />
          </div>
        )}

        <div className="mt-8 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              ["notes", `Notes (${notes.length})`],
              ["books", `Books (${books.length})`],
              ["papers", `Papers (${papers.length})`],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-3 text-sm font-medium ${tab === id ? "text-[#29C7C9] border-b-2 border-[#29C7C9]" : "text-gray-600"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeList.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">No items in this section.</div>
            ) : (
              <div className="space-y-3">
                {activeList.map((item) => (
                  <div key={item._id} className="border border-gray-100 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[#22292F]">{item.title}</div>
                      <div className="text-sm text-gray-500">
                        By {item.uploadedBy?.name || "Unknown"} • {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                      </div>
                    </div>

                    {user.role === "Admin" ? (
                      <button
                        onClick={() => handleDelete(tab, item._id)}
                        className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm">
                        View only
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-[#22292F] mt-1">{value ?? 0}</div>
    </div>
  );
}