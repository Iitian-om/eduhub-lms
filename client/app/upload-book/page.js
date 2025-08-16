"use client";
/**
 * Upload Book Page Component
 * 
 * This page allows Admin and Instructor users to upload book resources to the platform.
 * It includes a form for entering book details and uploading a PDF file.
 * 
 * Features:
 * - Book metadata entry (title, author, description, category, etc.)
 * - PDF file upload with validation
 * - Role-based access control
 * - Form validation and error handling
 */

import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../utils/api";

export default function UploadBookPage() {
  // Access user context for authentication and user info
  const { user, loading } = useUser();
  const router = useRouter();
  
  // Initialize form state with default values
  const [formData, setFormData] = useState({
    title: "",             // Book title
    description: "",       // Book description
    author: "",            // Book author
    category: "Computer Science", // Default category
    level: "Beginner",     // Default difficulty level
    tags: "",              // Comma-separated tags
    markdownContent: ""    // Additional markdown content/notes
  });
  
  // State for the uploaded file, submission status, and messages
  const [bookFile, setBookFile] = useState(null);  // Stores the PDF file
  const [submitting, setSubmitting] = useState(false); // Controls loading state
  const [error, setError] = useState("");          // Error message
  const [success, setSuccess] = useState("");      // Success message

  // Effect for authentication and role-based access control
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push("/login");
    } else if (!loading && user && user.role !== "Admin" && user.role !== "Instructor") {
      // Redirect to dashboard if user doesn't have required role
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  /**
   * Handles changes in form input fields
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update form data while preserving other fields
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
        e.target.value = ""; // Clear the input
        return;
      }
      
      // Validate file size (3MB max as per backend requirements)
      if (file.size > 3 * 1024 * 1024) {
        setError("File size must be less than 3MB");
        e.target.value = ""; // Clear the input
        return;
      }
      
      // Store file and clear any previous errors
      setBookFile(file);
      setError("");
    }
  };

  /**
   * Handles form submission to upload book
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate that a file is selected
    if (!bookFile) {
      setError("Please upload a PDF file");
      return;
    }

    // Set submission state and clear messages
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Create FormData object for multipart/form-data submission (required for file uploads)
    const formDataToSend = new FormData();
    formDataToSend.append("bookFile", bookFile);
    
    // Append all form fields to the FormData object
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      // Send POST request to the book creation endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/books`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        body: formDataToSend,   // Send as multipart/form-data
      });

      const data = await response.json();

      if (data.success) {
        // Handle successful upload
        setSuccess("Book uploaded successfully!");
        
        // Reset form to initial state
        setFormData({
          title: "",
          description: "",
          author: "",
          category: "Computer Science",
          level: "Beginner",
          tags: "",
          markdownContent: ""
        });
        setBookFile(null);
        
        // Redirect to books page after short delay (for user to see success message)
        setTimeout(() => {
          router.push("/books");
        }, 2000);
      } else {
        // Handle server error response
        setError(data.message || "Failed to upload book");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Upload error:", error);
      setError("Network error. Please try again.");
    } finally {
      // Reset submitting state
      setSubmitting(false);
    }
  };
  // Loading and access control checks
  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  if (user.role !== "Admin" && user.role !== "Instructor") return null;

  return (
    <div className="min-h-screen bg-[#F7F9FA] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#22292F] mb-2">
              Upload Book
            </h1>
            <p className="text-gray-600">
              Share knowledge through educational books and resources
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
                Book File (PDF) *
              </label>
              <input
                type="file"
                name="bookFile"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Max file size: 3MB. Only PDF files are allowed.
              </p>
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
                {submitting ? "Uploading Book..." : "Upload Book"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">📚 Tips for Uploading Books:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Ensure you have the right to share this book (copyright, licenses, etc.)</li>
              <li>• Use descriptive titles and comprehensive descriptions</li>
              <li>• Add relevant tags to help users find your book</li>
              <li>• Optimize PDF file size while maintaining quality</li>
              <li>• Include enough details in the description about the book's content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}