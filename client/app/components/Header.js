"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { usePathname } from "next/navigation";

const Header = () => {
  const { user, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const guestLinks = [
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/contact", label: "Contact" },
    { href: "/resources", label: "Resources" },
    { href: "/profiles", label: "Profiles" }
  ];

  const memberLinks = [
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/support", label: "Ask EduBuddy AI" },
  ];

  const currentLinks = user ? memberLinks : guestLinks;
  const roleLinks = [];

  if (!loading && user && (user.role === "Admin" || user.role === "Mod")) {
    roleLinks.push({ href: "/moderation", label: "Moderation" });
  }

  if (!loading && user && user.role === "Admin") {
    roleLinks.push({ href: "/admin", label: "Admin" });
  }

  const allLinks = [...currentLinks, ...roleLinks];

  const navLinkClass = (href) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-[#29C7C9] text-white shadow-sm"
        : "text-[#22313A] hover:bg-[#E7F8F8] hover:text-[#178E90]"
    }`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#D6EEEF] bg-white/90 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="EduHub Home">
          <Image
            src="/eduhub-logo.png"
            alt="EduHub Logo"
            width={92}
            height={62}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {allLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-[#7EDFE1] px-4 py-2 text-sm font-semibold text-[#177F81] transition hover:bg-[#E7F8F8]"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="rounded-full bg-[#29C7C9] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#22b3b5]"
              >
                {user.name}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full bg-[#29C7C9] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#22b3b5]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-[#7EDFE1] px-4 py-2 text-sm font-semibold text-[#177F81] transition hover:bg-[#E7F8F8]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="flex items-center rounded-md p-1 text-[#29C7C9] transition hover:bg-[#E7F8F8] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="h-7 w-7"
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

      {menuOpen && (
        <div className="border-t border-[#D6EEEF] bg-white px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(link.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            {loading ? null : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-[#7EDFE1] px-4 py-2 text-center text-sm font-semibold text-[#177F81] transition hover:bg-[#E7F8F8]"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="rounded-full bg-[#29C7C9] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#22b3b5]"
                  onClick={() => setMenuOpen(false)}
                >
                  {user.name}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full bg-[#29C7C9] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#22b3b5]"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-[#7EDFE1] px-4 py-2 text-center text-sm font-semibold text-[#177F81] transition hover:bg-[#E7F8F8]"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;