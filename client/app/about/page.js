import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F7F9FA] py-8 px-2">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow flex flex-col items-center">
        <Image src="/eduhub-logo.png" alt="EduHub Logo" width={100} height={100} className="mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-[#22292F] mb-4">About EduHub LMS</h1>
        <p className="mb-2 text-gray-700 text-center">
          EduHub LMS is a modern, user-friendly learning management system designed to empower students, instructors, and administrators. Our mission is to make online education accessible, interactive, and effective for everyone.
        </p>
        <p className="mb-4 text-gray-700 text-center">
          Built with <span className="font-semibold text-[#29C7C9]">Next.js</span>, <span className="font-semibold text-[#29C7C9]">Tailwind CSS</span>, and a robust backend, EduHub offers a seamless experience for course management, learning, and collaboration.
        </p>
        <div className="mt-6 w-full">
          <h2 className="text-xl font-semibold text-[#22292F] mb-2">Our Mission</h2>
          <p className="text-gray-600 mb-4">To democratize education by providing a platform that is accessible, engaging, and effective for all learners.</p>
          <h2 className="text-xl font-semibold text-[#22292F] mb-2">Tech Stack</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Next.js (Frontend)</li>
            <li>Tailwind CSS (Styling)</li>
            <li>Express & MongoDB (Backend)</li>
            <li>JWT Authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}