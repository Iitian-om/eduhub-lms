"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UsersIcon, BookOpenIcon, DocumentTextIcon, AcademicCapIcon, ChartBarIcon, CogIcon, DocumentChartBarIcon, ShieldCheckIcon, BellIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: HomeIcon,
      description: "Overview and statistics"
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: UsersIcon,
      description: "Manage all users"
    },
    {
      name: "Courses",
      href: "/admin/courses",
      icon: BookOpenIcon,
      description: "Manage courses and content"
    },
    {
      name: "Content",
      href: "/admin/content",
      icon: DocumentTextIcon,
      description: "Manage notes, books, papers"
    },
    {
      name: "Instructors",
      href: "/admin/instructors",
      icon: AcademicCapIcon,
      description: "Manage instructors"
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: ChartBarIcon,
      description: "Platform analytics"
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: DocumentChartBarIcon,
      description: "Detailed reports"
    },
    {
      name: "Audit Logs",
      href: "/admin/audit-logs",
      icon: ShieldCheckIcon,
      description: "System audit logs"
    },
    {
      name: "Notifications",
      href: "/admin/notifications",
      icon: BellIcon,
      description: "Manage notifications"
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: CogIcon,
      description: "Platform settings"
    }
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#29C7C9] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-bold text-gray-900">EduHub Admin</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 group ${
                  isActive
                    ? 'bg-[#29C7C9] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={isCollapsed ? item.description : ""}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && (
                  <div>
                    <span className="font-medium">{item.name}</span>
                    {!isActive && (
                      <p className="text-xs text-gray-500 group-hover:text-gray-700">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
} 