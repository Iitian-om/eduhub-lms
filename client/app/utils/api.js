// API configuration utility
const getApiUrl = () => {
  // Check if we're in production (Vercel)
  if (typeof window !== 'undefined' && window.location.hostname === 'eduhub-lms-rose.vercel.app') {
    return 'https://eduhub-crit.onrender.com';
  }
  
  // Development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 