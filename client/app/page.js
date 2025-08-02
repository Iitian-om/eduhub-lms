import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[90vh] bg-[#F7F9FA] pt-8">
      <div className="max-w-3xl w-full flex flex-col items-center text-center">
        <Image src="/eduhub-logo.png" alt="EduHub Logo" width={120} height={120} className="mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-[#22292F] mb-4">Welcome to <span className="text-[#29C7C9]">EduHub LMS</span></h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          A modern, user-friendly learning management system for students, instructors, and administrators.
        </p>
        <Link href="/courses" className="inline-block bg-[#29C7C9] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#22b6b7] transition mb-2">
          Get Started
        </Link>
        <Link href="/about" className="inline-block text-[#29C7C9] hover:underline mt-2">Learn more about EduHub</Link>
      </div>
    </main>
  );
}
