"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from '../../context/UserContext'; // Correct for your file!
import { useContext } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { 
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  CreditCardIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "EduHub LMS",
      siteDescription: "Your comprehensive learning management system",
      contactEmail: "admin@eduhub.com",
      supportPhone: "+1-555-0123",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h"
    },
    security: {
      passwordMinLength: 8,
      requireEmailVerification: true,
      allowSocialLogin: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableTwoFactor: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      courseUpdates: true,
      systemMaintenance: true,
      marketingEmails: false
    },
    payment: {
      currency: "USD",
      stripeEnabled: true,
      paypalEnabled: false,
      taxRate: 0.08,
      refundPolicy: "7 days",
      autoRenewal: true
    },
    content: {
      maxFileSize: 50,
      allowedFileTypes: ["pdf", "doc", "docx", "mp4", "jpg", "png"],
      autoApproveCourses: false,
      contentModeration: true,
      plagiarismCheck: true
    }
  });

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      router.push("/login");
      return;
    }
    fetchSettings();
  }, [user, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/settings`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Use default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (tabName) => {
    setSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/settings/${tabName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings[tabName])
      });

      if (response.ok) {
        toast.success(`${tabName.charAt(0).toUpperCase() + tabName.slice(1)} settings saved successfully`);
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (tabName, key, value) => {
    setSettings(prev => ({
      ...prev,
      [tabName]: {
        ...prev[tabName],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: "general", name: "General", icon: CogIcon },
    { id: "security", name: "Security", icon: ShieldCheckIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "payment", name: "Payment", icon: CreditCardIcon },
    { id: "content", name: "Content", icon: DocumentTextIcon }
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
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-2">Configure your platform settings and preferences</p>
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

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === "general" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting("general", "siteName", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSetting("general", "contactEmail", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                  <input
                    type="text"
                    value={settings.general.supportPhone}
                    onChange={(e) => updateSetting("general", "supportPhone", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => updateSetting("general", "timezone", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting("general", "siteDescription", e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSetting("security", "passwordMinLength", parseInt(e.target.value))}
                      min="6"
                      max="20"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting("security", "sessionTimeout", parseInt(e.target.value))}
                      min="1"
                      max="72"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireEmailVerification"
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) => updateSetting("security", "requireEmailVerification", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-900">
                      Require email verification for new accounts
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowSocialLogin"
                      checked={settings.security.allowSocialLogin}
                      onChange={(e) => updateSetting("security", "allowSocialLogin", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="allowSocialLogin" className="ml-2 block text-sm text-gray-900">
                      Allow social media login
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableTwoFactor"
                      checked={settings.security.enableTwoFactor}
                      onChange={(e) => updateSetting("security", "enableTwoFactor", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900">
                      Enable two-factor authentication
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateSetting("notifications", "emailNotifications", e.target.checked)}
                    className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                    Enable email notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => updateSetting("notifications", "pushNotifications", e.target.checked)}
                    className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                  />
                  <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-900">
                    Enable push notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="courseUpdates"
                    checked={settings.notifications.courseUpdates}
                    onChange={(e) => updateSetting("notifications", "courseUpdates", e.target.checked)}
                    className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                  />
                  <label htmlFor="courseUpdates" className="ml-2 block text-sm text-gray-900">
                    Notify users about course updates
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="systemMaintenance"
                    checked={settings.notifications.systemMaintenance}
                    onChange={(e) => updateSetting("notifications", "systemMaintenance", e.target.checked)}
                    className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                  />
                  <label htmlFor="systemMaintenance" className="ml-2 block text-sm text-gray-900">
                    Notify about system maintenance
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    checked={settings.notifications.marketingEmails}
                    onChange={(e) => updateSetting("notifications", "marketingEmails", e.target.checked)}
                    className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                  />
                  <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-900">
                    Allow marketing emails
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={settings.payment.currency}
                    onChange={(e) => updateSetting("payment", "currency", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.payment.taxRate}
                    onChange={(e) => updateSetting("payment", "taxRate", parseFloat(e.target.value))}
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
                  <select
                    value={settings.payment.refundPolicy}
                    onChange={(e) => updateSetting("payment", "refundPolicy", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  >
                    <option value="7 days">7 days</option>
                    <option value="14 days">14 days</option>
                    <option value="30 days">30 days</option>
                    <option value="No refunds">No refunds</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stripeEnabled"
                      checked={settings.payment.stripeEnabled}
                      onChange={(e) => updateSetting("payment", "stripeEnabled", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="stripeEnabled" className="ml-2 block text-sm text-gray-900">
                      Enable Stripe payments
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="paypalEnabled"
                      checked={settings.payment.paypalEnabled}
                      onChange={(e) => updateSetting("payment", "paypalEnabled", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="paypalEnabled" className="ml-2 block text-sm text-gray-900">
                      Enable PayPal payments
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoRenewal"
                      checked={settings.payment.autoRenewal}
                      onChange={(e) => updateSetting("payment", "autoRenewal", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="autoRenewal" className="ml-2 block text-sm text-gray-900">
                      Enable auto-renewal for subscriptions
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum File Size (MB)</label>
                  <input
                    type="number"
                    value={settings.content.maxFileSize}
                    onChange={(e) => updateSetting("content", "maxFileSize", parseInt(e.target.value))}
                    min="1"
                    max="500"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
                  <input
                    type="text"
                    value={settings.content.allowedFileTypes.join(", ")}
                    onChange={(e) => updateSetting("content", "allowedFileTypes", e.target.value.split(", "))}
                    placeholder="pdf, doc, docx, mp4, jpg, png"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoApproveCourses"
                      checked={settings.content.autoApproveCourses}
                      onChange={(e) => updateSetting("content", "autoApproveCourses", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="autoApproveCourses" className="ml-2 block text-sm text-gray-900">
                      Auto-approve new courses
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="contentModeration"
                      checked={settings.content.contentModeration}
                      onChange={(e) => updateSetting("content", "contentModeration", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="contentModeration" className="ml-2 block text-sm text-gray-900">
                      Enable content moderation
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="plagiarismCheck"
                      checked={settings.content.plagiarismCheck}
                      onChange={(e) => updateSetting("content", "plagiarismCheck", e.target.checked)}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="plagiarismCheck" className="ml-2 block text-sm text-gray-900">
                      Enable plagiarism checking
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={() => handleSave(activeTab)}
                disabled={saving}
                className="bg-[#29C7C9] text-white px-6 py-2 rounded-lg hover:bg-[#1f9ca3] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 