"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from '../../context/UserContext'; // ✅ Correct for your file!
import { useContext } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { 
  BellIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AdminNotifications() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "normal",
    targetAudience: "all",
    scheduledFor: "",
    isActive: true
  });

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      router.push("/login");
      return;
    }
    fetchNotifications();
  }, [user, router]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notifications`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = modalType === "edit" 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notifications/${selectedNotification._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notifications`;

      const response = await fetch(url, {
        method: modalType === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Notification ${modalType === "edit" ? "updated" : "created"} successfully`);
        setShowModal(false);
        fetchNotifications();
      } else {
        const error = await response.json();
        toast.error(error.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (notificationId) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Notification deleted successfully");
        fetchNotifications();
      } else {
        toast.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete notification");
    }
  };

  const toggleStatus = async (notificationId, currentStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notifications/${notificationId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        toast.success(`Notification ${!currentStatus ? "activated" : "deactivated"} successfully`);
        fetchNotifications();
      } else {
        toast.error("Failed to update notification status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update notification status");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "error":
        return <XMarkIcon className="w-5 h-5 text-red-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckIcon className="w-5 h-5 text-green-500" />;
      case "info":
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "info":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Manage system notifications and announcements</p>
            </div>
            <button
              onClick={() => {
                setModalType("create");
                setFormData({
                  title: "",
                  message: "",
                  type: "info",
                  priority: "normal",
                  targetAudience: "all",
                  scheduledFor: "",
                  isActive: true
                });
                setShowModal(true);
              }}
              className="bg-[#29C7C9] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#1f9ca3] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Notification</span>
            </button>
          </div>
        </div>

        {/* Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notification) => (
            <div key={notification._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(notification.type)}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                    {notification.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleStatus(notification._id, notification.isActive)}
                    className={`p-1 rounded-full ${
                      notification.isActive 
                        ? "text-green-600 hover:text-green-800" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    title={notification.isActive ? "Deactivate" : "Activate"}
                  >
                    {notification.isActive ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <XMarkIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNotification(notification);
                      setFormData({
                        title: notification.title,
                        message: notification.message,
                        type: notification.type,
                        priority: notification.priority,
                        targetAudience: notification.targetAudience,
                        scheduledFor: notification.scheduledFor ? notification.scheduledFor.split("T")[0] : "",
                        isActive: notification.isActive
                      });
                      setModalType("edit");
                      setShowModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{notification.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{notification.message}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Priority:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                    {notification.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Target:</span>
                  <span className="text-xs font-medium text-gray-900">{notification.targetAudience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Created:</span>
                  <span className="text-xs text-gray-900">{formatDate(notification.createdAt)}</span>
                </div>
                {notification.scheduledFor && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Scheduled:</span>
                    <span className="text-xs text-gray-900">{formatDate(notification.scheduledFor)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-4">
                {modalType === "edit" ? "Edit Notification" : "Create New Notification"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students Only</option>
                      <option value="instructors">Instructors Only</option>
                      <option value="admins">Admins Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule For (Optional)</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#29C7C9] text-white px-4 py-2 rounded-lg hover:bg-[#1f9ca3] transition-colors"
                >
                  {modalType === "edit" ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 