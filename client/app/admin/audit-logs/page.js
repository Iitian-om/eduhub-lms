"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AdminAuditLogs() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      router.push("/login");
      return;
    }
    fetchAuditLogs();
  }, [user, router, currentPage, levelFilter, actionFilter]);

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        level: levelFilter !== "all" ? levelFilter : "",
        action: actionFilter !== "all" ? actionFilter : "",
        search: searchTerm
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/audit-logs?${params}`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAuditLogs();
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "error":
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      case "success":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-2">Track system activities and user actions</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs by user, action, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                />
              </div>
            </form>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={actionFilter}
                  onChange={(e) => {
                    setActionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="enroll">Enroll</option>
                  <option value="payment">Payment</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getLevelIcon(log.level)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.user?.name || "System"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.user?.email || "system@eduhub.com"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {log.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatDate(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-[#29C7C9] hover:text-[#1f9ca3]"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-[#29C7C9] border-[#29C7C9] text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <InformationCircleIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
} 