"use client";

import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const { user, setUser, loading } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    bio: "",
    phone: "",
    location: "",
    gender: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      // Pre-fill form with current user data
      setFormData({
        name: user.name || "",
        userName: user.userName || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        gender: user.gender || ""
      });
    }
  }, [user, loading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update the user context with new data
      setUser(data.user);
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-[90vh] bg-[#F7F9FA] flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#22292F]">Edit Profile</h1>
          <Link 
            href="/profile" 
            className="text-[#29C7C9] hover:text-[#22b6b7] font-medium"
          >
            ← Back to Profile
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              maxLength={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
              minLength={3}
              maxLength={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
              placeholder="Enter your username"
            />
            <p className="text-xs text-gray-500 mt-1">3-15 characters, lowercase</p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={100}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent resize-none"
              placeholder="Tell us about yourself (max 100 characters)"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/100 characters</p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
              placeholder="Enter your location"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="flex gap-4">
              {["Male", "Female", "Transgender", "Prefer not to say"].map((gender) => (
                <label key={gender} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleInputChange}
                    className="text-[#29C7C9] focus:ring-[#29C7C9]"
                  />
                  <span className="ml-2 text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#29C7C9] text-white py-3 rounded-lg font-semibold hover:bg-[#22b6b7] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
            <Link
              href="/profile"
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 