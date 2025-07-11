// pages/notes/page.js
// This page lists all notes from the backend API
// Author: EduHub LMS

import React, { useEffect, useState } from 'react';

// NoteList component fetches and displays all notes
export default function NoteListPage() {
  // State to store notes, loading, and error
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes from backend API when component mounts
  useEffect(() => {
    // Replace with your actual backend API URL
    const API_URL = 'https://eduhub-crit.onrender.com/api/v1/notes';
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch notes');
        return res.json();
      })
      .then((data) => {
        setNotes(data.notes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Render loading, error, or note list
  return (
    <div className="min-h-[80vh] py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Notes Library</h1>
      {loading && <p>Loading notes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && notes.length === 0 && (
        <p>No notes found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div key={note._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
            <p className="text-gray-700 mb-1">{note.description}</p>
            <p className="text-gray-500 text-sm mb-2">Type: {note.type}</p>
            {/* Download link for the note file */}
            {note.fileUrl && (
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-auto"
              >
                Download Note
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 