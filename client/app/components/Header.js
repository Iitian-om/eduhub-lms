"use client"

import Link from "next/link";
import React from "react";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { user, loading } = useUser();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">EduHub</Link>
        </div>
        <nav className="space-x-8 text-lg">
          <Link href="/courses" className="text-gray-600 hover:text-gray-900">
            Courses
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>
        <div className="space-x-4">
          {loading ? null : user ? (
            <Link
              href="/profile"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
            >
              {user.name}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;