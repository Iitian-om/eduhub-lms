"use client";

/**
 * Edit Book Page Component
 * 
 * This page allows Admin and Instructor users to edit existing book details.
 * It loads the book data and presents a form for editing.
 * 
 * Features:
 * - Fetch existing book details
 * - Form for editing metadata (title, author, description, etc.)
 * - Option to replace the PDF file
 * - Role-based access control
 * - Form validation and error handling
 */

import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../utils/api";

export default function EditBookPage({ params }) {
  // Extract book ID from URL params
  const { bookId } = params;
  
  // Access user context for authentication and user info
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  
  // State for book data, loading, and messages
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    level: "",
    tags: "",
    markdownContent: ""
  });
  
  // State for the uploaded file, submission status, and messages
  const [bookFile, setBookFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  /**
   * Fetch book data when component mounts
   */
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/books/${bookId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch book data');
        }
        
        const data = await response.json();
        
        if (!data.success || !data.book) {
          throw new Error(data.message || 'Book not found');
        }
        
        // Store the book data
        setBookData(data.book);
        
        // Initialize form with book data
        const book = data.book;
        setFormData({
          title: book.title || "",
          description: book.description || "",
          author: book.author || "",
          category: book.category || "Computer Science",
          level: book.level || "Beginner",
          tags: book.tags ? book.tags.join(', ') : "",
          markdownContent: book.markdownContent || ""
        });
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);
  
  /**
   * Check for authentication and role-based access
   */
  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push("/login");
      } else if (user.role !== "Admin" && user.role !== "Instructor") {
        // Redirect to dashboard if user doesn't have required role
        router.push("/dashboard");
      }
    }
  }, [user, userLoading, router]);
  
  /**
   * Handles changes in form input fields
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handles file selection and validates file type and size
   * @param {Event} e - The file input change event
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file is PDF type
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        e.target.value = "";
        return;
      }
      
      // Validate file size (3MB max as per backend requirements)
      if (file.size > 3 * 1024 * 1024) {
        setError("File size must be less than 3MB");
        e.target.value = "";
        return;
      }
      
      setBookFile(file);
      setError("");
    }
  };
  
  /**
   * Handles form submission to update book
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Create FormData object for multipart/form-data submission
    const formDataToSend = new FormData();
    
    // Add file only if a new one was selected
    if (bookFile) {
      formDataToSend.append("bookFile", bookFile);
    }
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      // Send PUT request to update the book
      const response = await fetch(`${API_BASE_URL}/api/v1/books/${bookId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Book updated successfully!");
        
        // Redirect to books page after short delay
        setTimeout(() => {
          router.push("/books");
        }, 2000);
      } else {
        setError(data.message || "Failed to update book");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  // Access control check
  if (!user || (user.role !== "Admin" && user.role !== "Instructor")) {
    return null;
  }
  
  // Show error if book not found
  if (!bookData && !loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-red-100 text-red-700 p-4 rounded">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error || "Book not found"}</p>
          <button 
            onClick={() => router.push("/books")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F7F9FA] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#22292F] mb-2">
              Edit Book
            </h1>
            <p className="text-gray-600">
              Update information for "{bookData?.title}"
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Book author"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe the book content and what readers will learn"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Literature">Literature</option>
                  <option value="History">History</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Economics">Economics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="programming, algorithms, python"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Replace Book File (PDF)
              </label>
              <input
                type="file"
                name="bookFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Only select a file if you want to replace the current one. Max file size: 3MB.
              </p>
              {bookData?.fileUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Current file:</p>
                  <a 
                    href={bookData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline text-sm"
                  >
                    View current PDF
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Markdown)
              </label>
              <textarea
                name="markdownContent"
                value={formData.markdownContent}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add any additional notes or context using markdown"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Book"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/books")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
