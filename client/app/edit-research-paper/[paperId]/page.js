"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import Link from 'next/link';
import { API_BASE_URL } from '../../utils/api';

export default function EditResearchPaperPage({ params }) {
  const { paperId } = params;
  const router = useRouter();
  const { user } = useUser();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    keywords: '',
    field: '',
    publicationYear: '',
    journal: '',
    isPeerReviewed: false,
    doi: '',
    file: null
  });
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileChanged, setFileChanged] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');

  // Fetch research paper details
  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/research-papers/${paperId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch research paper details');
        }
        
        const data = await response.json();
        const paper = data.researchPaper;
        
        // Set the form data from the fetched paper
        setFormData({
          title: paper.title || '',
          authors: paper.authors ? paper.authors.join(', ') : '',
          abstract: paper.abstract || '',
          keywords: paper.keywords ? paper.keywords.join(', ') : '',
          field: paper.field || '',
          publicationYear: paper.publicationYear?.toString() || '',
          journal: paper.journal || '',
          isPeerReviewed: paper.isPeerReviewed || false,
          doi: paper.doi || '',
          file: null
        });
        
        setCurrentFileUrl(paper.fileUrl || '');
        
        // Check user permissions - only allow edit by admin or the instructor who uploaded it
        if (user && (user.role !== 'Admin' && 
            (user.role !== 'Instructor' || (paper.uploadedBy?._id !== user._id)))) {
          setError('You do not have permission to edit this research paper');
        }
        
      } catch (err) {
        console.error('Error fetching paper details:', err);
        setError(err.message || 'Failed to fetch paper details');
      } finally {
        setLoading(false);
      }
    };

    if (user && paperId) {
      fetchPaperDetails();
    } else if (!user) {
      // Redirect if not logged in
      router.push('/login');
    }
  }, [paperId, user, router]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!user || (user.role !== 'Admin' && user.role !== 'Instructor')) {
      setError('You do not have permission to edit research papers');
      return;
    }
    
    try {
      setError(null);
      setSubmitting(true);
      
      // Create FormData object for multipart/form-data submission
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('title', formData.title);
      submitFormData.append('abstract', formData.abstract);
      
      // Split comma-separated values into arrays
      if (formData.authors.trim()) {
        const authors = formData.authors.split(',').map(author => author.trim());
        authors.forEach((author, index) => {
          submitFormData.append(`authors[${index}]`, author);
        });
      }
      
      if (formData.keywords.trim()) {
        const keywords = formData.keywords.split(',').map(keyword => keyword.trim());
        keywords.forEach((keyword, index) => {
          submitFormData.append(`keywords[${index}]`, keyword);
        });
      }
      
      // Add remaining fields
      submitFormData.append('field', formData.field);
      submitFormData.append('publicationYear', formData.publicationYear);
      submitFormData.append('journal', formData.journal);
      submitFormData.append('isPeerReviewed', formData.isPeerReviewed);
      submitFormData.append('doi', formData.doi);
      
      // Add file if changed
      if (fileChanged && formData.file) {
        submitFormData.append('file', formData.file);
      }
      
      // Send PUT request
      const response = await fetch(`${API_BASE_URL}/api/v1/research-papers/${paperId}`, {
        method: 'PUT',
        body: submitFormData,
        credentials: 'include',
        // Do not set Content-Type header, let the browser set it with the boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update research paper');
      }
      
      // Show success message
      setSuccess(true);
      
      // Navigate back to research papers page after successful update
      setTimeout(() => {
        router.push('/research-papers');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating research paper:', err);
      setError(err.message || 'Failed to update the research paper. Please try again.');
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
            href="/research-papers"
            className="inline-block bg-[#2AC9C7] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#28B8B6] transition"
          >
            Back to Research Papers
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
          <h1 className="text-3xl font-bold text-gray-800">Edit Research Paper</h1>
          <p className="text-gray-600">Update the details of your research paper</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p className="font-bold">Success!</p>
            <p>Research paper updated successfully. Redirecting...</p>
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
                Paper Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Enter the title of your research paper"
              />
            </div>

            {/* Authors */}
            <div>
              <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-1">
                Authors <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="authors"
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Enter author names, separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple authors with commas</p>
            </div>

            {/* Abstract */}
            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-1">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                id="abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Provide a brief summary of your research paper"
              ></textarea>
            </div>

            {/* Keywords */}
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                placeholder="Enter keywords, separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple keywords with commas</p>
            </div>

            {/* Two columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field */}
              <div>
                <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  id="field"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                  placeholder="e.g., Computer Science, Medicine"
                />
              </div>

              {/* Publication Year */}
              <div>
                <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>

              {/* Journal */}
              <div>
                <label htmlFor="journal" className="block text-sm font-medium text-gray-700 mb-1">
                  Journal/Conference
                </label>
                <input
                  type="text"
                  id="journal"
                  name="journal"
                  value={formData.journal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                  placeholder="Journal or conference name"
                />
              </div>

              {/* DOI */}
              <div>
                <label htmlFor="doi" className="block text-sm font-medium text-gray-700 mb-1">
                  DOI (Digital Object Identifier)
                </label>
                <input
                  type="text"
                  id="doi"
                  name="doi"
                  value={formData.doi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AC9C7]"
                  placeholder="e.g., 10.1000/xyz123"
                />
              </div>
            </div>

            {/* Peer Review Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPeerReviewed"
                name="isPeerReviewed"
                checked={formData.isPeerReviewed}
                onChange={handleChange}
                className="h-4 w-4 text-[#2AC9C7] focus:ring-[#2AC9C7] border-gray-300 rounded"
              />
              <label htmlFor="isPeerReviewed" className="ml-2 block text-sm text-gray-700">
                This paper has been peer-reviewed
              </label>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paper PDF
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
                  {fileChanged ? 'Change File' : 'Replace PDF (optional)'}
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleFileChange}
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
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <Link
              href="/research-papers"
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
