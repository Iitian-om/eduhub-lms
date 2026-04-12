import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-[90vh] bg-[#F4FAFA] px-4 py-12 text-[#22313A] sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm sm:p-10">
          <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-[#BCEEEF]/35 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-[#B9DBFF]/25 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <Image src="/eduhub-logo.png" alt="EduHub Logo" width={105} height={105} className="mb-4" />
            <p className="rounded-full border border-[#BFE9EA] bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#2B5665]">
              Capstone Project Scaling to MVP
            </p>
            <h1 className="mt-4 text-4xl font-bold text-[#1B2A33] md:text-5xl">About EduHub LMS</h1>
            <p className="mt-4 max-w-3xl text-lg text-[#415E6B]">
              EduHub is an evolving academic platform focused on digital resource management and sharing. We help learners, educators, and institutions access trusted educational content in one organized environment.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#1B2A33]">Our Mission</h2>
            <p className="mt-3 text-[#4A6572]">
              Our mission is to make quality educational resources more accessible, practical, and collaborative. Instead of overwhelming users with complex systems, we prioritize clarity, reliability, and academic usefulness.
            </p>
            <p className="mt-3 text-[#4A6572]">
              We believe students and educators should spend more time learning and teaching, and less time searching for scattered materials.
            </p>
          </article>

          <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B2A33]">Current Focus</h2>
            <ul className="mt-3 space-y-2 text-[#4A6572]">
              <li>Digital resource organization</li>
              <li>Notes, books, and paper sharing</li>
              <li>Reliable document access</li>
              <li>Moderation-supported quality</li>
            </ul>
          </article>
        </div>

        <section className="mt-6 rounded-2xl border border-[#D7ECEE] bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">How EduHub Works for Professionals</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-[#E0EFF0] bg-[#FBFFFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#178E90]">Step 1</p>
              <h3 className="mt-1 text-lg font-semibold text-[#1B2A33]">Curate</h3>
              <p className="mt-2 text-sm text-[#4A6572]">Gather useful learning resources and organize them by academic intent.</p>
            </article>
            <article className="rounded-xl border border-[#E0EFF0] bg-[#FBFFFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#178E90]">Step 2</p>
              <h3 className="mt-1 text-lg font-semibold text-[#1B2A33]">Validate</h3>
              <p className="mt-2 text-sm text-[#4A6572]">Review quality and keep resources aligned with learner needs and curriculum goals.</p>
            </article>
            <article className="rounded-xl border border-[#E0EFF0] bg-[#FBFFFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#178E90]">Step 3</p>
              <h3 className="mt-1 text-lg font-semibold text-[#1B2A33]">Share</h3>
              <p className="mt-2 text-sm text-[#4A6572]">Distribute trusted materials to students and faculty through one central hub.</p>
            </article>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B2A33]">Platform Direction</h2>
            <p className="mt-3 text-[#4A6572]">
              EduHub started as a capstone initiative and is now being scaled into a production-ready MVP. We are intentionally focusing on stable resource management before expanding into broader features.
            </p>
            <p className="mt-3 text-[#4A6572]">
              Selling and marketplace capabilities are planned for future phases once infrastructure, governance, and reliability milestones are completed.
            </p>
          </article>

          <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B2A33]">Tech Foundation</h2>
            <ul className="mt-3 space-y-2 text-[#4A6572]">
              <li>Next.js frontend with responsive UI</li>
              <li>Express and MongoDB backend services</li>
              <li>JWT-based authentication and role access</li>
              <li>Cloud-hosted storage for academic files</li>
            </ul>
          </article>
        </div>

        <section className="mt-8 rounded-2xl border border-[#CDEDEE] bg-gradient-to-r from-[#E8F9F9] to-[#ECF6FF] p-7 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">Explore the Platform</h2>
          <p className="mx-auto mt-3 max-w-3xl text-[#46606D]">
            Discover how EduHub supports institutions, educators, and learners through organized digital resources and a practical, scalable product roadmap.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/resources" className="inline-block rounded-full bg-[#29C7C9] px-7 py-3 font-semibold text-white shadow transition hover:bg-[#1EAEB0]">
              Explore Resources
            </Link>
            <Link href="/contact" className="inline-block rounded-full border border-[#29C7C9] bg-white px-7 py-3 font-semibold text-[#178E90] transition hover:bg-[#E7F8F8]">
              Contact Team
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}