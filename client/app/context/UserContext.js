"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// API configuration
const getApiUrl = () => {
  // Check if we're in production (Vercel)
  if (typeof window !== 'undefined' && window.location.hostname === 'eduhub-lms-rose.vercel.app') {
    return 'https://eduhub-crit.onrender.com';
  }
  
  // Development
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiUrl();

export const UserProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const refetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users/profile`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile on mount (if logged in)
  useEffect(() => {
    refetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};