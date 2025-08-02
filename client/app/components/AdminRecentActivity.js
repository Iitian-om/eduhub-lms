"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

export default function AdminRecentActivity({ title, data, type }) {
  const [showAll, setShowAll] = useState(false);

  const getIcon = (type) => {
    return type === "users" ? UserIcon : BookOpenIcon;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const displayData = showAll ? data : data.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-[#29C7C9] hover:text-[#1f9ca3] font-medium"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      </div>

      <div className="p-6">
        {displayData.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {type === "users" ? (
                <UserIcon className="w-6 h-6 text-gray-400" />
              ) : (
                <BookOpenIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-gray-500">No {type} found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#29C7C9] rounded-full flex items-center justify-center">
                    {type === "users" ? (
                      <UserIcon className="w-5 h-5 text-white" />
                    ) : (
                      <BookOpenIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {type === "users" ? item.name : item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {type === "users" ? item.email : item.category}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(type === "users" ? item.created_At : item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {type === "users" && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status || "active")}`}>
                      {item.role}
                    </span>
                  )}
                  
                  <div className="flex space-x-1">
                    <Link
                      href={`/admin/${type}/${item._id}`}
                      className="p-1 text-gray-400 hover:text-[#29C7C9] transition-colors"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 