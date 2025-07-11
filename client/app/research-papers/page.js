// pages/research-papers/page.js
// This page lists all research papers from the backend API

import React, { useEffect, useState } from 'react';

// ResearchPaperList component fetches and displays all research papers
export default function ResearchPaperListPage() {
  // State to store research papers, loading, and error
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch research papers from backend API when component mounts
  useEffect(() => {
    // Replace with your actual backend API URL
    const API_URL = 'https://eduhub-crit.onrender.com/api/v1/research-papers';
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch research papers: (!res.ok error)');
        return res.json();
      })
      .then((data) => {
        setPapers(data.researchPapers || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Render loading, error, or research paper list
  return (
    <div className="min-h-[80vh] py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Research Papers Library</h1>
      {loading && <p>Loading research papers...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && papers.length === 0 && (
        <p>No research papers found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {papers.map((paper) => (
          <div key={paper._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{paper.title}</h2>
            <p className="text-gray-700 mb-1">{paper.abstract}</p>
            <p className="text-gray-500 text-sm mb-2">Authors: {paper.authors && paper.authors.join(', ')}</p>
            {/* Download link for the research paper file */}
            {paper.fileUrl && (
              <a
                href={paper.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-auto"
              >
                Download Paper
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 