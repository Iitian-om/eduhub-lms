"use client";
/**
 * Upload Research Paper Page Component
 * 
 * This page allows Admin and Instructor users to upload research paper resources to the platform.
 * It includes a form for entering research paper details and uploading a PDF file.
 * 
 * Features:
 * - Research paper metadata entry (title, abstract, authors, field, etc.)
 * - PDF file upload with validation
 * - Role-based access control
 * - Form validation and error handling
 */

import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../utils/api";

export default function UploadResearchPaperPage() {
  // Access user context for authentication and user info
  const { user, loading } = useUser();
  const router = useRouter();
  
  // Initialize form state with default values
  const [formData, setFormData] = useState({
    title: "",             // Research paper title
    abstract: "",          // Research paper abstract
    authors: "",           // Comma-separated authors
    field: "Computer Science", // Default field
    keywords: "",          // Comma-separated keywords
    publicationYear: new Date().getFullYear(), // Default to current year
    journal: "",           // Optional journal name
    doi: "",               // Optional DOI
    isPeerReviewed: false, // Whether the paper is peer-reviewed
    markdownContent: ""    // Additional markdown content/notes
  });
  
  // State for the uploaded file, submission status, and messages
  const [paperFile, setPaperFile] = useState(null);  // Stores the PDF file
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
    const { name, value, type, checked } = e.target;
    // Handle checkbox input differently
    const inputValue = type === 'checkbox' ? checked : value;
    
    // Update form data while preserving other fields
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
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
      
      // Validate file size (2MB max as per backend requirements)
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        e.target.value = ""; // Clear the input
        return;
      }
      
      // Store file and clear any previous errors
      setPaperFile(file);
      setError("");
    }
  };

  /**
   * Handles form submission to upload research paper
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate that a file is selected
    if (!paperFile) {
      setError("Please upload a PDF file");
      return;
    }

    // Set submission state and clear messages
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Create FormData object for multipart/form-data submission (required for file uploads)
    const formDataToSend = new FormData();
  formDataToSend.append("researchPaperFile", paperFile); // Match backend multer field name
    
    // Append all form fields to the FormData object
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      // Send POST request to the research paper creation endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/research-papers`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        body: formDataToSend,   // Send as multipart/form-data
      });

      const data = await response.json();

      if (data.success) {
        // Handle successful upload
        setSuccess("Research paper uploaded successfully!");
        
        // Reset form to initial state
        setFormData({
          title: "",
          abstract: "",
          authors: "",
          field: "Computer Science",
          keywords: "",
          publicationYear: new Date().getFullYear(),
          journal: "",
          doi: "",
          isPeerReviewed: false,
          markdownContent: ""
        });
        setPaperFile(null);
        
        // Redirect to research papers page after short delay (for user to see success message)
        setTimeout(() => {
          router.push("/research-papers");
        }, 2000);
      } else {
        // Handle server error response
        setError(data.message || "Failed to upload research paper");
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
              Upload Research Paper
            </h1>
            <p className="text-gray-600">
              Share academic research papers and publications
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
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                placeholder="Enter research paper title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authors * (comma separated)
              </label>
              <input
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                placeholder="John Doe, Jane Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract *
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                placeholder="A brief summary of the research paper's content (min 50 characters)"
                minLength={50}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Research *
                </label>
                <select
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Biology">Biology</option>
                  <option value="Business">Business</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Economics">Economics</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Physics">Physics</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Year *
                </label>
                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleInputChange}
                  required
                  min={1900}
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords * (comma separated)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                placeholder="artificial intelligence, machine learning, neural networks"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Journal (optional)
                </label>
                <input
                  type="text"
                  name="journal"
                  value={formData.journal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                  placeholder="Journal name (if published)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DOI (optional)
                </label>
                <input
                  type="text"
                  name="doi"
                  value={formData.doi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                  placeholder="Digital Object Identifier (e.g., 10.1000/xyz123)"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPeerReviewed"
                id="isPeerReviewed"
                checked={formData.isPeerReviewed}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#2AC9C7] focus:ring-[#2AC9C7]"
              />
              <label htmlFor="isPeerReviewed" className="ml-2 block text-sm text-gray-700">
                This paper has been peer-reviewed
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Research Paper File (PDF) *
              </label>
              <input
                type="file"
                name="researchPaperFile" /* MUST match server multer.single('researchPaperFile') */
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Max file size: 2MB. Only PDF files are allowed.
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                placeholder="Add any additional notes or context using markdown"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#2AC9C7] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#28B8B6] transition disabled:opacity-50"
              >
                {submitting ? "Uploading Paper..." : "Upload Research Paper"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/research-papers")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-[#2AC9C7]/10 rounded-lg">
            <h3 className="font-semibold text-[#2AC9C7] mb-2">📑 Tips for Uploading Research Papers:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Ensure you have the right to share this research paper (copyright, licenses, etc.)</li>
              <li>• Provide detailed information about authors and publication details</li>
              <li>• Use descriptive keywords to help users find your paper</li>
              <li>• Include an informative abstract that summarizes the research</li>
              <li>• Optimize PDF file size while maintaining quality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
