"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const refetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
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