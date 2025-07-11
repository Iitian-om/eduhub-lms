// pages/books/page.js
// This page lists all books from the backend API
// Author: EduHub LMS

import React, { useEffect, useState } from 'react';

// BookList component fetches and displays all books
export default function BookListPage() {
  // State to store books, loading, and error
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from backend API when component mounts
  useEffect(() => {
    // Replace with your actual backend API URL
    const API_URL = 'https://eduhub-crit.onrender.com/api/v1/books';
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then((data) => {
        setBooks(data.books || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Render loading, error, or book list
  return (
    <div className="min-h-[80vh] py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Books Library</h1>
      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && books.length === 0 && (
        <p>No books found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
            <p className="text-gray-700 mb-1">{book.description}</p>
            <p className="text-gray-500 text-sm mb-2">Author: {book.author}</p>
            {/* Download link for the book file */}
            {book.fileUrl && (
              <a
                href={book.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-auto"
              >
                Download Book
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 