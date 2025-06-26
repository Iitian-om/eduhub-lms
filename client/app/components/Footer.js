"use client";

import React from "react";

// Setting svg icons for social media links
const socialLinks =
  [
    {
      label: "Facebook", url: "#", icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      label: "Twitter", url: "#", icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    },
    {
      label: "Google", url: "#", icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )
    },
    {
      label: "Instagram", url: "#", icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.354-.2-6.782-2.619-6.979-6.98-.059-1.281-.074-1.69-.074-4.949 0-3.259.013-3.668.071-4.948.2-4.358 2.618-6.78 6.98-6.98 1.281-.059 1.689-.073 4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      label: "LinkedIn", url: "#", icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      label: "GitHub", url: "https://github.com/omkumar-dev/eduhub-lms", icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.243 2.874 1.128 3.176.691.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    },
  ];

// Footer component definition
const Footer = () => {
  return (
    <footer className="text-[#22292F] bg-[#ECEFF1] pt-0 w-full">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-1 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h6 className="uppercase font-bold mb-4">EduHub LMS</h6>
            <div className="w-16 h-1 bg-[#7c4dff] mb-4" />
            <p>
              EduHub LMS is a modern, user-friendly learning management system.
            </p>
          </div>

          {/* Social Links */}
          <div> <h6 className="uppercase font-bold mb-4">Social Links</h6>
            <div className="w-16 h-1 bg-[#7c4dff] mb-4" />
            <p className="mb-4">Follow us on our social media channels:</p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#22292F] transition">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          {/* Useful Links */}
          <div>
            <h6 className="uppercase font-bold mb-4">Useful Links</h6>
            <div className="w-16 h-1 bg-[#7c4dff] mb-4" />
            <ul className="list-none space-y-2">
              <li><a href="/profile" className="text-[#22292F] hover:text-[#29C7C9]">Your Account</a></li>
              <li><a href="/privacy" className="text-[#22292F] hover:text-[#29C7C9]">Privacy Policy</a></li>
              <li><a href="/terms" className="text-[#22292F] hover:text-[#29C7C9]">Terms of Service</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h6 className="uppercase font-bold mb-4">Contact</h6>
            <div className="w-16 h-1 bg-[#7c4dff] mb-4" />
            <ul className="list-none space-y-2">
              <li className="flex items-center gap-2">New Delhi, Delhi-NCT 110044, IND</li>
              <li className="flex items-center gap-2">
                <a href="mailto:info@eduhub.com" className="hover:underline hover:text-[#29C7C9]">info@eduhub.com</a>
              </li>
              <li className="flex items-center gap-2">
                <a href="tel:+0123456788" className="hover:underline hover:text-[#29C7C9]">+01 234 567 88</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center p-3 bg-[#22292F] text-[#F7F9FA] text-sm">
        © {new Date().getFullYear()} EduHub LMS. All rights reserved. | <a className="text-[#29C7C9] hover:underline" href="https://github.com/Iitian-om/eduhub-lms" target="_blank" rel="noopener noreferrer">Source Code</a>
      </div>
    </footer>
  );
};

export default Footer;