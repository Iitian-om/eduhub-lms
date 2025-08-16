"use client";
/**
 * Upload Note Page Component
 * 
 * This page allows Admin and Instructor users to upload educational notes to the platform.
 * It includes a form for entering note details and uploading a file.
 * 
 * Features:
 * - Note metadata entry (title, description, type, subject, etc.)
 * - PDF file upload with validation
 * - Role-based access control
 * - Form validation and error handling
 * - Option for content type (file upload or manual writing)
 */

import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../utils/api";

export default function UploadNotePage() {
    // Access user context for authentication and user info
    const { user, loading } = useUser();
    const router = useRouter();

    // Initialize form state with default values
    const [formData, setFormData] = useState({
        title: "",             // Note title
        description: "",       // Note description
        type: "Lecture Notes", // Default type
        subject: "",           // Subject
        course: "",            // Optional related course
        tags: "",              // Comma-separated tags
        contentType: "file",   // Default content type (file, manual, or both)
        markdownContent: "",   // Additional markdown content
        richTextContent: ""    // Rich text content for manual notes
    });

    // State for the uploaded file, submission status, and messages
    const [noteFile, setNoteFile] = useState(null);  // Stores the file
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

            // Validate file size (2MB max as per backend requirements)
            if (file.size > 2 * 1024 * 1024) {
                setError("File size must be less than 2MB");
                e.target.value = ""; // Clear the input
                return;
            }

            // Store file and clear any previous errors
            setNoteFile(file);
            setError("");
        }
    };

    /**
     * Handles form submission to upload note
     * @param {Event} e - The form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that file is uploaded if content type requires it
        if ((formData.contentType === "file" || formData.contentType === "both") && !noteFile) {
            setError("Please upload a PDF file");
            return;
        }

        // Validate that rich text content is provided if content type requires it
        if ((formData.contentType === "manual" || formData.contentType === "both") && !formData.richTextContent) {
            setError("Please provide text content for the note");
            return;
        }

        // Set submission state and clear messages
        setSubmitting(true);
        setError("");
        setSuccess("");

        // Create FormData object for multipart/form-data submission
        const formDataToSend = new FormData();

        // Only append file if content type requires it
        if (formData.contentType === "file" || formData.contentType === "both") {
            // MUST match backend multer field name: uploadNote.single('noteFile')
            formDataToSend.append("noteFile", noteFile);
        }

        // Append all form fields to the FormData object
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            // Send POST request to the note creation endpoint
            const response = await fetch(`${API_BASE_URL}/api/v1/notes`, {
                method: 'POST',
                credentials: 'include', // Include cookies for authentication
                body: formDataToSend,   // Send as multipart/form-data
            });

            const data = await response.json();

            if (data.success) {
                // Handle successful upload
                setSuccess("Note uploaded successfully!");

                // Reset form to initial state
                setFormData({
                    title: "",
                    description: "",
                    type: "Lecture Notes",
                    subject: "",
                    course: "",
                    tags: "",
                    contentType: "file",
                    markdownContent: "",
                    richTextContent: ""
                });
                setNoteFile(null);

                // Redirect to notes page after short delay (for user to see success message)
                setTimeout(() => {
                    router.push("/notes");
                }, 2000);
            } else {
                // Handle server error response
                setError(data.message || "Failed to upload note");
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
    // Check if user is logged in if not return a message to login
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA]">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-[#2AC9C7] mb-4">Login Required</h2>
                <p className="text-black-700 mb-4">Please login or sign up to upload notes.</p>
                <a href="/login" className="inline-block bg-[#2AC9C7] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#28B8B6] transition">Go to Login</a>
            </div>
            </div>
        );
    }
    // Check if user has the permission to upload notes
    if (user.role !== "Admin" && user.role !== "Instructor") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA]">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Permission Denied</h2>
                    <p className="text-black-700">You do not have permission to upload notes. Only instructors and Admins can upload notes. Please contact your administrator if you believe this is an error.</p>
                </div>
            </div>
        );
    }
    // The UI for uploading notes
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F9FA] py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">

                    {/* Tips & Rules For uploading */}
                    <div className="mt-8 p-4 bg-[#2AC9C7]/10 rounded-lg">
                        <h3 className="font-semibold text-[#2AC9C7] mb-2">📝 Tips for Uploading Notes:</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Use clear and descriptive titles</li>
                            <li>• Categorize notes correctly with appropriate type and subject</li>
                            <li>• Add relevant tags to help users find your notes</li>
                            <li>• For file uploads, ensure PDF is well-formatted and readable</li>
                            <li>• If creating manual notes, use clear structure and formatting</li>
                        </ul>
                    </div>

                    {/* Div Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#22292F] mb-2">
                            Upload Note
                        </h1>
                        <p className="text-gray-600">
                            Share educational notes and study materials
                        </p>
                    </div>

                    {/* Error message below the Div Header */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* Success message below the Div Header */}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                            {success}
                        </div>
                    )}

                    {/* The Form to upload a Note*/}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Note Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                                placeholder="Enter note title"
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
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                                placeholder="Describe the note content briefly"
                                minLength={10}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                                >
                                    <option value="Lecture Notes">Lecture Notes</option>
                                    <option value="Study Material">Study Material</option>
                                    <option value="Assignment">Assignment</option>
                                    <option value="Tutorial">Tutorial</option>
                                    <option value="Summary">Summary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                                    placeholder="Subject area (e.g., Data Structures)"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content Type *
                            </label>
                            <select
                                name="contentType"
                                value={formData.contentType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                            >
                                <option value="file">File Upload Only</option>
                                <option value="manual">Manual Text Entry Only</option>
                                <option value="both">Both File and Manual Text</option>
                            </select>
                        </div>

                        {(formData.contentType === "file" || formData.contentType === "both") && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note File (PDF) {formData.contentType === "both" ? "" : "*"}
                                </label>
                                <input
                                    type="file"
                                    name="noteFile"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    required={formData.contentType === "file"}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Max file size: 2MB. Only PDF files are allowed.
                                </p>
                            </div>
                        )}

                        {(formData.contentType === "manual" || formData.contentType === "both") && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note Content {formData.contentType === "both" ? "" : "*"}
                                </label>
                                <textarea
                                    name="richTextContent"
                                    value={formData.richTextContent}
                                    onChange={handleInputChange}
                                    required={formData.contentType === "manual"}
                                    rows={8}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                                    placeholder="Write your note content here"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] focus:border-transparent"
                                placeholder="algorithms, notes, mathematics"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes (Markdown)
                            </label>
                            <textarea
                                name="markdownContent"
                                value={formData.markdownContent}
                                onChange={handleInputChange}
                                rows={4}
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
                                {submitting ? "Uploading Note..." : "Upload Note"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/notes")}
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