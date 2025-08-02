"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from '../../context/UserContext'; // ✅ Correct for your file!
import { useContext } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { 
  DocumentChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AdminReports() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30");
  const [reports, setReports] = useState({
    overview: {
      totalRevenue: 0,
      totalEnrollments: 0,
      activeUsers: 0,
      courseCompletionRate: 0
    },
    revenue: {
      monthly: [],
      topCourses: [],
      topInstructors: []
    },
    users: {
      growth: [],
      demographics: [],
      activity: []
    },
    courses: {
      performance: [],
      categories: [],
      completion: []
    }
  });

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      router.push("/login");
      return;
    }
    fetchReports();
  }, [user, router, dateRange]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reports?dateRange=${dateRange}`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reports/export/${type}?dateRange=${dateRange}`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`${type} report exported successfully`);
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: DocumentChartBarIcon },
    { id: "revenue", name: "Revenue", icon: CurrencyDollarIcon },
    { id: "users", name: "Users", icon: UsersIcon },
    { id: "courses", name: "Courses", icon: BookOpenIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#29C7C9]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">Comprehensive platform insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={() => exportReport(activeTab)}
                className="bg-[#29C7C9] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#1f9ca3] transition-colors"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-[#29C7C9] text-[#29C7C9]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(reports.overview.totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(reports.overview.totalEnrollments)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(reports.overview.activeUsers)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BookOpenIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{reports.overview.courseCompletionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <DocumentChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue chart visualization</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <DocumentChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">User growth chart visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                <div className="space-y-3">
                  {reports.revenue.monthly.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue Courses</h3>
                <div className="space-y-3">
                  {reports.revenue.topCourses.map((course, index) => (
                    <div key={course._id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.title}</p>
                        <p className="text-xs text-gray-500">{course.instructor?.name}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(course.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h3>
                <div className="space-y-3">
                  {reports.users.demographics.map((demo, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{demo.category}</span>
                      <span className="text-sm font-medium text-gray-900">{demo.count} users</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
                <div className="space-y-3">
                  {reports.users.activity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{activity.type}</span>
                      <span className="text-sm font-medium text-gray-900">{activity.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
                <div className="space-y-3">
                  {reports.courses.performance.map((course, index) => (
                    <div key={course._id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.title}</p>
                        <p className="text-xs text-gray-500">{course.enrolledStudents?.length || 0} students</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{course.rating || 0}/5</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Categories</h3>
                <div className="space-y-3">
                  {reports.courses.categories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category.name}</span>
                      <span className="text-sm font-medium text-gray-900">{category.count} courses</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 