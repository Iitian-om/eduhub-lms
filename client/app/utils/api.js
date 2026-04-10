// API configuration utility
const normalizeUrl = (url) => url.replace(/\/+$/, "");
let hasWarnedMissingApiUrl = false;   // Flag to ensure we only warn once about missing API URL in development

const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return normalizeUrl(envUrl.trim());
  }

  // Warn in development if the API URL is missing, but only once

  if (process.env.NODE_ENV === "development" && !hasWarnedMissingApiUrl) {
    hasWarnedMissingApiUrl = true;
    console.warn(
      "NEXT_PUBLIC_API_URL is not set. Falling back to default API base URL. Add client/.env.local for local development."
    );
  }

  // Fallbacks when env vars are not set
  if (typeof window !== "undefined" && window.location.hostname === "eduhub-lms-rose.vercel.app") {
    return "https://eduhub-crit.onrender.com";
  }

  return "http://localhost:5000";
};

// Setting up the Bankend Url As per the condition (Development or production)
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
    // Making the API call
    const response = await fetch(url, defaultOptions);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};