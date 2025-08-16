"use client";
/**
 * Books Page Component
 * 
 * This page displays all books from the backend API.
 * Features:
 * - List all available books with their details
 * - Download functionality for books
 * - Admin/Instructor can edit or delete books
 * - Responsive grid layout
 * - Loading and error states
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../utils/api';

// BookList component fetches and displays all books
export default function BookListPage() {
  // State for user context, books data, and UI states
  const { user } = useUser();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // For delete confirmation
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  /**
   * Fetch all books from the backend API
   */
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/books`); // Adjust API endpoint as needed

      if (!response.ok) // If the response is not okay
        {
          throw new Error('Failed to fetch books');
        }
      
      const data = await response.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);
  
  /**
   * Handle book deletion with confirmation
   * @param {string} bookId - ID of book to delete
   */
  const handleDeleteBook = async (bookId) => {
    if (deleteConfirmId !== bookId) {
      // First click - Show confirmation
      setDeleteConfirmId(bookId);
      return;
    }
    
    // Second click - Actually delete the book
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/books/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      
      // Show success message and refresh the book list
      setActionMessage({ type: 'success', text: 'Book deleted successfully!' });
      setDeleteConfirmId(null);
      fetchBooks();
      
      // Clear success message after 3 seconds
      setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error deleting book:', err);
      setActionMessage({ type: 'error', text: err.message || 'Failed to delete book' });
      
      // Clear error message after 3 seconds
      setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
    }
  };

  /**
   * Render component
   * - Shows loading state while fetching books
   * - Shows error message if fetch failed
   * - Shows books in a grid layout
   * - Includes admin/instructor controls when appropriate
   */
  return (
    <div className="min-h-[80vh] bg-gray-50">
      {/* Hero section with background */}
      <div className="bg-gradient-to-r from-[#2AC9C7] to-[#2A8EC9] text-white py-12 px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Books Library</h1>
              <p className="text-white/80 max-w-xl">
                Explore our collection of educational books and resources to enhance your learning journey.
              </p>
            </div>
            
            {/* Upload button only shown to admins and instructors */}
            {user && (user.role === "Admin" || user.role === "Instructor") && (
              <Link 
                href="/upload-book" 
                className="mt-6 md:mt-0 bg-white text-[#2AC9C7] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload New Book
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Action messages (success/error) */}
        {actionMessage.text && (
          <div className={`mb-6 p-4 rounded-lg shadow-sm ${
            actionMessage.type === 'success' 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
              : 'bg-red-50 text-red-700 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center">
              {actionMessage.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {actionMessage.text}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#2AC9C7]"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading books...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-sm mb-8">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold">Something went wrong</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#2AC9C7]/10 text-[#2AC9C7] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.776-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No books in library yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Your library is empty. Be the first to contribute to our growing collection of educational resources.</p>
            
            {user && (user.role === "Admin" || user.role === "Instructor") && (
              <Link href="/upload-book" className="inline-flex items-center bg-[#2AC9C7] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#28B8B6] transition shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Your First Book
              </Link>
            )}
          </div>
        )}
        
        {/* Books grid */}
        {!loading && !error && books.length > 0 && (
          <>
            {/* Filter/search could go here in future updates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {books.map((book) => (
                <div key={book._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col border border-gray-100">
                  {/* Book header with ribbon style category */}
                  <div className="relative pt-3">
                    <div className="absolute top-0 right-0 bg-[#2AC9C7]/10 text-[#2AC9C7] py-1 px-4 text-xs font-semibold">
                      {book.level}
                    </div>
                    <div className="px-5 mb-3">
                      <span className="inline-block px-3 py-1 bg-[#2AC9C7]/10 text-[#2AC9C7] text-xs font-semibold rounded-full mb-2">
                        {book.category}
                      </span>
                      <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{book.title}</h2>
                      <p className="text-gray-600 text-sm">By {book.author}</p>
                    </div>
                  </div>
                  
                  {/* Book content */}
                  <div className="p-5 flex-grow">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{book.description}</p>
                    
                    {/* Tags */}
                    {book.tags && book.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {book.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Upload info with icons */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {book.uploadedBy?.name && (
                        <p className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {book.uploadedBy.name}
                        </p>
                      )}
                      {book.createdAt && (
                        <p className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions footer */}
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    {/* Download button */}
                    {book.fileUrl && (
                      <a
                        href={book.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#2AC9C7] text-white text-center py-2 rounded-lg hover:bg-[#28B8B6] transition mb-2 font-medium flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Book
                      </a>
                    )}
                    
                    {/* Admin/instructor controls */}
                    {user && (user.role === "Admin" || (user.role === "Instructor" && book.uploadedBy?._id === user._id)) && (
                      <div className="flex gap-2 mt-2">
                        <Link 
                          href={`/edit-book/${book._id}`}
                          className="flex-1 text-center px-3 py-1.5 border border-[#2AC9C7] text-[#2AC9C7] rounded-lg hover:bg-[#2AC9C7]/10 transition flex items-center justify-center text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className={`flex-1 px-3 py-1.5 rounded-lg transition flex items-center justify-center text-sm ${
                            deleteConfirmId === book._id
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'border border-red-400 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {deleteConfirmId === book._id ? 'Confirm' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 