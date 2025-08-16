"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import Link from 'next/link';
import { API_BASE_URL } from '../../utils/api';

export default function EditNotePage({ params }) {
  const { noteId } = params;
  const router = useRouter();
  const { user } = useUser();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    contentType: 'file', // 'file' or 'text'
    content: '',
    description: '',
    tags: '',
    file: null
  });
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileChanged, setFileChanged] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');

  // Fetch note details
  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/notes/${noteId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch note details');
        }
        
        const data = await response.json();
        const note = data.note;
        
        // Set the form data from the fetched note
        setFormData({
          title: note.title || '',
          subject: note.subject || '',
          contentType: note.fileUrl ? 'file' : 'text',
          content: note.content || '',
          description: note.description || '',
          tags: note.tags ? note.tags.join(', ') : '',
          file: null
        });
        
        setCurrentFileUrl(note.fileUrl || '');
        
        // Check user permissions - only allow edit by admin or the user who uploaded it
        if (user && (user.role !== 'Admin' && note.uploadedBy?._id !== user._id)) {
          setError('You do not have permission to edit this note');
        }
        
      } catch (err) {
        console.error('Error fetching note details:', err);
        setError(err.message || 'Failed to fetch note details');
      } finally {
        setLoading(false);
      }
    };

    if (user && noteId) {
      fetchNoteDetails();
    } else if (!user) {
      // Redirect if not logged in
      router.push('/login');
    }
  }, [noteId, user, router]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle content type change
  const handleContentTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      contentType: type
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setFileChanged(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to update notes');
      return;
    }
    
    try {
      setError(null);
      setSubmitting(true);
      
      // Create FormData object for multipart/form-data submission
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('title', formData.title);
      submitFormData.append('subject', formData.subject);
      submitFormData.append('description', formData.description);
      
      // Split comma-separated tags into array
      if (formData.tags.trim()) {
        const tags = formData.tags.split(',').map(tag => tag.trim());
        tags.forEach((tag, index) => {
          submitFormData.append(`tags[${index}]`, tag);
        });
      }
      
      // Handle content type specific data
      if (formData.contentType === 'text') {
        submitFormData.append('content', formData.content);
        submitFormData.append('contentType', 'text');
      } else {
        submitFormData.append('contentType', 'file');
        // Add file if it was changed
        if (fileChanged && formData.file) {
          submitFormData.append('file', formData.file);
        }
      }
      
      // Send PUT request
      const response = await fetch(`${API_BASE_URL}/api/v1/notes/${noteId}`, {
        method: 'PUT',
        body: submitFormData,
        credentials: 'include',
        // Do not set Content-Type header, let the browser set it with the boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update note');
      }
      
      // Show success message
      setSuccess(true);
      
      // Navigate back to notes page after successful update
      setTimeout(() => {
        router.push('/notes');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating note:', err);
      setError(err.message || 'Failed to update the note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#2AC9C7]"></div>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 mt-8">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <Link 
            href="/notes"
            className="inline-block bg-[#2AC9C7] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#28B8B6] transition"
          >
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Note</h1>
          <p className="text-gray-600">Update your educational note</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p className="font-bold">Success!</p>
            <p>Note updated successfully. Redirecting...</p>
          </div>
        )}

        {/* Error message */}
        {error && submitting && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Note Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Enter a title for your note"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Subject or course related to this note"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Briefly describe what this note covers"
              ></textarea>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Enter tags, separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas (e.g., midterm, chapter1, formulas)</p>
            </div>

            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="contentTypeFile"
                    name="contentType"
                    value="file"
                    checked={formData.contentType === 'file'}
                    onChange={handleContentTypeChange}
                    className="h-4 w-4 text-[#2AC9C7] focus:ring-[#2AC9C7] border-gray-300"
                  />
                  <label htmlFor="contentTypeFile" className="ml-2 block text-sm text-gray-700">
                    Upload PDF File
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="contentTypeText"
                    name="contentType"
                    value="text"
                    checked={formData.contentType === 'text'}
                    onChange={handleContentTypeChange}
                    className="h-4 w-4 text-[#2AC9C7] focus:ring-[#2AC9C7] border-gray-300"
                  />
                  <label htmlFor="contentTypeText" className="ml-2 block text-sm text-gray-700">
                    Text Content
                  </label>
                </div>
              </div>
            </div>

            {/* Conditional Content Input */}
            {formData.contentType === 'text' ? (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Note Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required={formData.contentType === 'text'}
                  rows="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7] font-mono"
                  placeholder="Enter your note content here..."
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">You can use plain text or markdown for formatting</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note PDF File {formData.contentType === 'file' && !currentFileUrl && !fileChanged && <span className="text-red-500">*</span>}
                </label>
                {currentFileUrl && !fileChanged && (
                  <div className="mb-2 text-sm">
                    <span className="text-gray-600">Current file: </span>
                    <a 
                      href={currentFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#2AC9C7] hover:underline"
                    >
                      View current PDF
                    </a>
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {fileChanged ? 'Change File' : currentFileUrl ? 'Replace PDF (optional)' : 'Upload PDF'}
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required={formData.contentType === 'file' && !currentFileUrl}
                    className="sr-only"
                  />
                  {fileChanged && formData.file && (
                    <span className="ml-3 text-sm text-gray-600">
                      {formData.file.name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Only PDF files are accepted. Max size: 10MB.</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <Link
              href="/notes"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 bg-[#2AC9C7] text-white rounded-lg hover:bg-[#28B8B6] focus:outline-none ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
