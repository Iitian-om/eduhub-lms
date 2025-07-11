// "use client";

// // Import necessary hooks and components
// import { useUser } from "../context/UserContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import Link from "next/link"; // Import Link from Next.js for navigation

// // Dashboard Page Component
// export default function DashboardPage() {
//   const { user, loading } = useUser(); // Access user context

//   // Use Next.js router for navigation
//   const router = useRouter(); // Redirect user if not logged in

//   // Effect to redirect to login if user is not authenticated
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [user, loading, router]);

//   // If loading or user is not available, return loading state or null
//   // This prevents rendering the dashboard until user data is ready
//   if (loading) return <div>Loading...</div>;
//   if (!user) return null;

//   // Render the dashboard content if user's data is available and is user authenticated
//   return (

//     // Dashboard Page
//     <div className="min-h-[80vh] py-8 px-2 bg-[#F7F9FA]">
//       <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Welcome Card */}
//         <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-[#22292F] mb-2">
//               Welcome back, <span className="text-[#29C7C9]">{user.name}</span>!
//             </h1>
//             <p className="text-gray-600 mb-4">
//               Here's your personalized dashboard. Track your courses, progress, and explore new learning opportunities!
//             </p>
//           </div>
//           {/* Buttons in Welcome Card */}
//           <div className="flex flex-wrap gap-4 mt-4">
//             <Link href="/courses" className="bg-[#29C7C9] text-white px-4 py-2 rounded shadow hover:bg-[#22b3b5] transition">
//               Browse Courses
//             </Link>
//             <Link href="/profile" className="bg-white border border-[#29C7C9] text-[#29C7C9] px-4 py-2 rounded shadow hover:bg-[#e0f7f7] transition">
//               View Profile
//             </Link>
//           </div>
//         </div>

//         {/* Quick Links Card */}
//         <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
//           <h2 className="text-xl font-semibold text-[#22292F] mb-4">Quick Links</h2>
//             <p className="text-gray-600 mb-4">
//               Access your profile and courses quickly from here. Click on the links below to navigate directly.
//             </p>

//           {/* Quick Links List */}
//           <ul className="space-y-2">
//             <li>
//               <Link href="/profile" className="text-[#29C7C9] hover:underline">Profile</Link>
//             </li>
//             <li>
//               <Link href="/courses" className="text-[#29C7C9] hover:underline">Courses</Link>
//             </li>
//           </ul>
//         </div>

//         {/* Your Courses Card */}
//         <div className="col-span-1 md:col-span-3 bg-white rounded-xl shadow p-6 mt-6">
//           <h2 className="text-xl font-semibold text-[#22292F] mb-4">Your Courses</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

//             {/* Placeholder cards for enrolled courses */}
//             <div className="bg-[#F7F9FA] rounded-lg p-4 flex flex-col items-start shadow hover:shadow-lg transition">
//               <div className="w-10 h-10 bg-[#29C7C9] rounded-full flex items-center justify-center text-white font-bold mb-2">JS</div>
//               <h3 className="font-semibold text-[#22292F]">JavaScript Basics</h3>
//               <p className="text-gray-500 text-sm mb-2">Progress: 60%</p>
//               <button className="mt-auto bg-[#29C7C9] text-white px-3 py-1 rounded hover:bg-[#22b3b5] text-sm">Continue</button>
//             </div>

//             <div className="bg-[#F7F9FA] rounded-lg p-4 flex flex-col items-start shadow hover:shadow-lg transition">
//               <div className="w-10 h-10 bg-[#29C7C9] rounded-full flex items-center justify-center text-white font-bold mb-2">DS</div>
//               <h3 className="font-semibold text-[#22292F]">Data Structures</h3>
//               <p className="text-gray-500 text-sm mb-2">Progress: 30%</p>
//               <button className="mt-auto bg-[#29C7C9] text-white px-3 py-1 rounded hover:bg-[#22b3b5] text-sm">Continue</button>
//             </div>

//             <div className="bg-[#F7F9FA] rounded-lg p-4 flex flex-col items-start shadow hover:shadow-lg transition">
//               <div className="w-10 h-10 bg-[#29C7C9] rounded-full flex items-center justify-center text-white font-bold mb-2">WD</div>
//               <h3 className="font-semibold text-[#22292F]">Web Development</h3>
//               <p className="text-gray-500 text-sm mb-2">Progress: 80%</p>
//               <button className="mt-auto bg-[#29C7C9] text-white px-3 py-1 rounded hover:bg-[#22b3b5] text-sm">Continue</button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const courseProgressData = [
    { name: "Completed", value: 70 },
    { name: "Remaining", value: 30 },
  ];

  const COLORS = ["#0284c7", "#e5e7eb"];

  return (
    <div className="min-h-[80vh] py-8 px-4 bg-[#F7F9FA]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-4xl font-bold text-sky-700 mb-2">
            Welcome back, <span className="text-[#29C7C9]">{user.name}</span>!
          </h1>
          <p className="text-gray-600 mb-4">
            Here's your personalized dashboard. Track your courses, progress, and explore new learning opportunities!
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/courses" className="bg-[#29C7C9] text-white px-4 py-2 rounded shadow hover:bg-[#22b3b5] transition">
              Browse Courses
            </Link>
            <Link href="/profile" className="bg-white border border-[#29C7C9] text-[#29C7C9] px-4 py-2 rounded shadow hover:bg-[#e0f7f7] transition">
              View Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-semibold text-sky-700">🎓 Enrolled Courses</h2>
            <p className="text-2xl mt-2 font-bold text-gray-800">6</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-semibold text-sky-700">📄 Pending Assignments</h2>
            <p className="text-2xl mt-2 font-bold text-gray-800">2</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-semibold text-sky-700">✅ Profile Completion</h2>
            <p className="text-2xl mt-2 font-bold text-gray-800">80%</p>
          </div>
        </div>

        {/* Weekly Study Goal */}
        <div>
          <h2 className="text-2xl font-bold text-sky-700 mb-2">🎯 Weekly Study Goal</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-sky-600 h-4 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="mt-1 text-sm text-gray-600">3/5 hours completed this week</p>
        </div>

        {/* Course Completion Chart */}
        <div>
          <h2 className="text-2xl font-bold text-sky-700 mb-4">📈 Course Completion</h2>
          <div className="h-64 w-full md:w-1/3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseProgressData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {courseProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Continue Learning */}
        <div>
          <h2 className="text-2xl font-bold text-sky-700 mb-4">📚 Continue Learning</h2>
          <ul className="space-y-3">
            <li className="bg-white p-4 shadow rounded-xl flex justify-between">
              <span>Data Science</span>
              <button className="bg-sky-600 text-white px-4 py-1 rounded hover:bg-sky-700">Resume</button>
            </li>
            <li className="bg-white p-4 shadow rounded-xl flex justify-between">
              <span>MySQL</span>
              <button className="bg-sky-600 text-white px-4 py-1 rounded hover:bg-sky-700">Resume</button>
            </li>
          </ul>
        </div>

        {/* Daily Motivation */}
        <div className="bg-sky-100 text-sky-900 border-l-4 border-sky-600 p-4 rounded-xl italic">
          💡 “Learning never exhausts the mind.” – Leonardo da Vinci
        </div>
      </div>
    </div>
  );
}