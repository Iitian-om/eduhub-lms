"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!name || !userName || !email || !password || !gender) {
      // If any required field is empty, set error and return
      res.status(400);
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    // Check Profile Picture Size
    if (profilePic && profilePic.size > 2 * 1024 * 1024) {
      setError("Profile picture must be under 2MB.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name); // Name is required
      formData.append("userName", userName); // Username is required
      formData.append("email", email); // Email is required
      formData.append("password", password);
      formData.append("gender", gender);
      // Password Length validation
      if (password.length < 7) {
        throw new Error("Password must be at least 7 characters long.");
      }
      // Append profile picture if it exists
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      // Send POST request to registeration API to register the user
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong while registering.");
      }

      toast.success("Account created in DB successfully!");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F7F9FA] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-[#22292F] mb-6">Create your <span className="text-[#29C7C9]">EduHub</span> account</h2>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <form className="space-y-5" onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" id="name" name="name" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9]" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input type="text" id="userName" name="userName" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9]" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" id="email" name="email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9]" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" id="password" name="password" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29C7C9]" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input type="radio" name="gender" value="Male" checked={gender === "Male"} onChange={() => setGender("Male")}/>
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="gender" value="Female" checked={gender === "Female"} onChange={() => setGender("Female")}/>
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (max 2MB)</label>
            <input type="file" id="profilePic" name="profilePic" accept="image/*" className="w-full" onChange={e => setProfilePic(e.target.files[0])} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#29C7C9] text-white py-2 rounded-lg font-semibold hover:bg-[#22b6b7] transition disabled:opacity-60">{loading ? "Registering..." : "Register"}</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#29C7C9] hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}