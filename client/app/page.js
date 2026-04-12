import Image from "next/image";
import Link from "next/link";

export default function Home() {
    const services = [
        {
            title: "Digital Resource Hub",
            description:
                "Organize and share notes, books, and research papers in one trusted space built for fast academic access.",
        },
        {
            title: "Resource Governance",
            description:
                "Maintain quality with moderation-ready workflows, structured metadata, and reliable document access.",
        },
        {
            title: "AI Learning Support",
            description:
                "Support learners with quick answers through EduBuddy AI while they explore educational content.",
        },
        {
            title: "Lightweight Course Management",
            description:
                "Course tools are currently basic due to budget and infrastructure limits, with gradual improvements planned.",
        },
    ];

    const professionalUseCases = [
        {
            step: "1",
            title: "Curate",
            detail: "Academic professionals collect and structure high-value notes, books, and research materials.",
        },
        {
            step: "2",
            title: "Validate",
            detail: "Teams review quality, maintain relevance, and keep resource libraries aligned with learning goals.",
        },
        {
            step: "3",
            title: "Share",
            detail: "Institutions and educators distribute trusted digital resources for consistent learner outcomes.",
        },
    ];

    const customerSegments = [
        {
            name: "Schools",
            description:
                "Unify digital resource delivery and learner access in one centralized platform.",
        },
        {
            name: "Training Institutes",
            description:
                "Run programs with organized resource libraries while keeping operations simple and efficient.",
        },
        {
            name: "Independent Educators",
            description:
                "Build your teaching presence by publishing trusted notes, references, and research materials.",
        },
        {
            name: "Small Research Communities",
            description:
                "Promote collaboration through structured sharing of papers, notes, and academic references.",
        },
    ];

    return (
        <main className="min-h-[90vh] bg-[#F4FAFA] text-[#22313A]">
            <section className="relative overflow-hidden border-b border-[#CDEDEE] bg-gradient-to-br from-[#E7F8F8] via-[#F9FEFF] to-[#EAF6FF]">
                <p className="absolute right-4 top-4 z-20 rounded-full border border-[#BFE9EA] bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#2B5665] sm:right-6 sm:top-6">
                    Capstone to MVP
                </p>
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 pb-16 pt-14 text-center sm:px-6 lg:px-8">
                    <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-[#BCEEEF]/40 blur-3xl" aria-hidden="true" />
                    <div className="absolute -right-16 bottom-8 h-48 w-48 rounded-full bg-[#B9DBFF]/30 blur-3xl" aria-hidden="true" />

                    <Image src="/eduhub-logo.png" alt="EduHub Logo" width={122} height={122} className="relative z-10" />

                    <div className="relative z-10 max-w-4xl">
                        <h1 className="mb-5 text-4xl font-bold leading-tight text-[#1B2A33] md:text-6xl">
                            Build Better Learning Experiences with <span className="text-[#1AAFB2]">EduHub LMS</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-[#3D5663] md:text-xl">
                            Our focus is on digital learning resource management and sharing for academic teams, educators, and learners.
                        </p>
                    </div>

                    <p className="relative z-10 rounded-full border border-[#BFE9EA] bg-white/80 px-5 py-2 text-sm font-medium text-[#2B5665]">
                        Selling and commercial marketplace features are part of our future roadmap.
                    </p>

                    <div className="relative z-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/resources" className="inline-block rounded-full bg-[#29C7C9] px-7 py-3 font-semibold text-white shadow-md transition hover:bg-[#1EAEB0]">
                            Explore Resources
                        </Link>
                        <Link href="/about" className="inline-block rounded-full border border-[#29C7C9] bg-white/80 px-7 py-3 font-semibold text-[#178E90] transition hover:bg-[#E7F8F8]">
                            Learn How EduHub Works
                        </Link>
                    </div>

                    {/* Hero Section Cards */}
                    <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
                        <div className="rounded-2xl border border-[#D9EFF0] bg-white/90 p-5 shadow-sm">
                            <p className="text-sm font-semibold text-[#178E90]">For Institutions</p>
                            <p className="mt-2 text-sm text-[#3D5663]">Standardize document libraries and resource access across departments.</p>
                        </div>
                        <div className="rounded-2xl border border-[#D9EFF0] bg-white/90 p-5 shadow-sm">
                            <p className="text-sm font-semibold text-[#178E90]">For Educators</p>
                            <p className="mt-2 text-sm text-[#3D5663]">Share curated notes and references quickly with your learners.</p>
                        </div>
                        <div className="rounded-2xl border border-[#D9EFF0] bg-white/90 p-5 shadow-sm">
                            <p className="text-sm font-semibold text-[#178E90]">For Learners</p>
                            <p className="mt-2 text-sm text-[#3D5663]">Access trusted books, notes, and research papers in one place.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/*  Brief About + Services Section */}
            <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mb-10 rounded-2xl border border-[#CFE9EA] bg-white p-7 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#178E90]">About EduHub in Brief</p>
                    <h2 className="mt-2 text-3xl font-bold text-[#1B2A33] md:text-4xl">A modern academic resource platform</h2>
                    <p className="mt-3 max-w-4xl text-[#4A6572]">
                        EduHub LMS helps students, instructors, and administrators access and share educational resources with a practical, user-friendly experience. Our mission is to make quality learning materials more accessible, interactive, and effective for everyone.
                    </p>
                    <Link href="/about" className="mt-5 inline-block rounded-full border border-[#29C7C9] px-5 py-2 font-semibold text-[#178E90] transition hover:bg-[#E7F8F8]">
                        Read full About
                    </Link>
                </div>

                <div className="mb-8 flex flex-col gap-3 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#178E90]">Services</p>
                    <h2 className="text-3xl font-bold text-[#1B2A33] md:text-4xl">Focused on Digital Resource Excellence</h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {services.map((service) => (
                        <article key={service.title} className="rounded-2xl border border-[#DBF1F2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                            <h3 className="text-xl font-semibold text-[#1B2A33]">{service.title}</h3>
                            <p className="mt-3 text-[#4A6572]">{service.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Mini Tutorial Section */}
            <section className="border-y border-[#D8ECEE] bg-[#FCFFFF]">
                <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#178E90]">What Professionals Do</p>
                        <h2 className="text-3xl font-bold text-[#1B2A33] md:text-4xl">How Teams Use EduHub Day to Day</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {professionalUseCases.map((item) => (
                            <article key={item.step} className="rounded-2xl border border-[#DCEFF0] bg-white p-6 shadow-sm">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1AAFB2] text-sm font-bold text-white">
                                    {item.step}
                                </span>
                                <h3 className="mt-4 text-xl font-semibold text-[#1B2A33]">{item.title}</h3>
                                <p className="mt-2 text-[#4A6572]">{item.detail}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Target Customers Section */}
            <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#178E90]">Target Customers</p>
                    <h2 className="text-3xl font-bold text-[#1B2A33] md:text-4xl">Built for Diverse Learning Ecosystems</h2>
                </div>
                {/* Customer Segments */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {customerSegments.map((segment) => (
                        <article key={segment.name} className="rounded-2xl border border-[#DBF1F2] bg-white p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-[#1B2A33]">{segment.name}</h3>
                            <p className="mt-3 text-[#4A6572]">{segment.description}</p>
                        </article>
                    ))}
                </div>

                {/* Call-to-Action Section */}
                <div className="mt-10 rounded-2xl border border-[#CDEDEE] bg-gradient-to-r from-[#E8F9F9] to-[#ECF6FF] p-7 text-center shadow-sm">
                    <h3 className="text-2xl font-bold text-[#1B2A33]">Ready to transform your learning experience?</h3>
                    <p className="mx-auto mt-3 max-w-2xl text-[#46606D]">
                        Start with digital resources today while we keep expanding the platform roadmap for future capabilities.
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/resources" className="inline-block rounded-full bg-[#29C7C9] px-7 py-3 font-semibold text-white shadow transition hover:bg-[#1EAEB0]">
                            Explore Resources
                        </Link>
                        <Link href="/contact" className="inline-block rounded-full border border-[#29C7C9] bg-white px-7 py-3 font-semibold text-[#178E90] transition hover:bg-[#E7F8F8]">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
