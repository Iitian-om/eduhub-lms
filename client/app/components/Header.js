"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" },
];

const Header = () => {
  const { user, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#F7F9FA] shadow-md w-full border-b-2 border-[#29C7C9]">
      {/* Top Header */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* Link for Logo + HomePage */}
        <Link href="/" className="flex items-center gap-2">

          <Image
            src="/eduhub-logo.png"
            alt="EduHub Logo-bg removed"
            width={150}
            height={75}
            className="rounded-full"
            priority
          />

        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-lg">
          {
            // Mapping through navLinks to create desktop links
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[#22292F] font-medium transition-colors duration-200
                after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#29C7C9] after:transition-all after:duration-300
                hover:text-[#29C7C9] hover:after:w-full"
              >
                {link.label}
              </Link>
            ))
          }

        </nav>

        {/* User Profile / Login/Register Buttons */}
        <div className="hidden md:flex space-x-4">
          {loading ? null : user ? (
            <Link
              href="/profile"
              className="bg-[#29C7C9] text-white px-4 py-2 rounded hover:bg-[#22b3b5] font-semibold transition"
            >
              {user.name}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-[#29C7C9] text-white px-4 py-2 rounded hover:bg-[#22b3b5] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white border border-[#29C7C9] text-[#29C7C9] px-4 py-2 rounded hover:bg-[#e0f7f7] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7 text-[#29C7C9]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F7F9FA] px-4 pb-4">
          <nav className="flex flex-col space-y-2">
            {
              // Mapping through navLinks to create mobile links
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-[#22292F] font-medium transition-colors duration-200
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#29C7C9] after:transition-all after:duration-300
                  hover:text-[#29C7C9] hover:after:w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))
            }

            {
              // Conditional rendering based on loading and user state
              loading ? null : user ? (
                // Link to Profile if logged in
                <Link
                  href="/profile"
                  className="bg-[#29C7C9] text-white px-4 py-2 rounded hover:bg-[#22b3b5] font-semibold transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {user.name}
                </Link>
              ) : (
                // Buttons for getting started if not logged in
                <>
                  {/* Login Kink Button */}
                  <Link
                    href="/login"
                    className="bg-[#29C7C9] text-white px-4 py-2 rounded hover:bg-[#22b3b5] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  {/* Register Link Butoon */}
                  <Link
                    href="/register"
                    className="bg-white border border-[#29C7C9] text-[#29C7C9] px-4 py-2 rounded hover:bg-[#e0f7f7] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )
            }
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;