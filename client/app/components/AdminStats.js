"use client";

import { 
  UsersIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  DocumentTextIcon,
  ArrowArrowTrendingUpIcon,
  ArrowArrowArrowTrendingDownIcon
} from "@heroicons/react/24/outline";

export default function AdminStats({ stats }) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpenIcon,
      color: "bg-green-500",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Instructors",
      value: stats.totalInstructors,
      icon: AcademicCapIcon,
      color: "bg-purple-500",
      change: "+5%",
      changeType: "increase"
    },
    {
      title: "Content Items",
      value: stats.totalContent,
      icon: DocumentTextIcon,
      color: "bg-orange-500",
      change: "+15%",
      changeType: "increase"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            {stat.changeType === "increase" ? (
              <ArrowArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              stat.changeType === "increase" ? "text-green-600" : "text-red-600"
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
} 