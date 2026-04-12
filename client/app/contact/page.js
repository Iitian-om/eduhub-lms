"use client"
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="min-h-[90vh] bg-[#F4FAFA] px-4 py-12 text-[#22313A] sm:px-6 lg:px-8">
            {/* Contact hero */}
            <section className="mx-auto mb-8 w-full max-w-6xl rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm sm:p-10">
                <p className="inline-block rounded-full border border-[#BFE9EA] bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#2B5665]">
                    Contact
                </p>
                <h1 className="mt-4 text-4xl font-bold text-[#1B2A33] md:text-5xl">Let us build better learning together</h1>
                <p className="mt-3 max-w-3xl text-[#4A6572]">
                    Reach out for product queries, collaboration opportunities, or platform feedback. Our team typically responds within 24-48 hours.
                </p>
            </section>

            {/* Contact content */}
            <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
                <aside className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm lg:col-span-1">
                    <h2 className="text-xl font-bold text-[#1B2A33]">Contact Channels</h2>
                    <ul className="mt-4 space-y-3 text-sm text-[#4A6572]">
                        <li>Email: support@eduhub.com</li>
                        <li>Response Window: 24-48 hours</li>
                        <li>Focus: Resource workflows and platform usage</li>
                    </ul>
                    <Link href="/about" className="mt-5 inline-block rounded-full border border-[#29C7C9] px-4 py-2 text-sm font-semibold text-[#178E90] transition hover:bg-[#E7F8F8]">
                        Learn About EduHub
                    </Link>
                </aside>

                <div className="rounded-2xl border border-[#D7ECEE] bg-white p-7 shadow-sm lg:col-span-2">
                    <h2 className="text-2xl font-bold text-[#1B2A33]">Send a Message</h2>
                    <p className="mt-2 text-[#4A6572]">Share your request and we will get back to you shortly.</p>

                    {submitted ? (
                        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                            Thank you for contacting us. We will get back to you soon.
                        </div>
                    ) : (
                        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                            {/* Name input */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#274451]" htmlFor="name">Name</label>
                                <input type="text" id="name" className="w-full rounded-xl border border-[#D4E8EA] px-4 py-3 focus:border-[#29C7C9] focus:outline-none" required />
                            </div>

                            {/* Email input */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#274451]" htmlFor="email">Email</label>
                                <input type="email" id="email" className="w-full rounded-xl border border-[#D4E8EA] px-4 py-3 focus:border-[#29C7C9] focus:outline-none" required />
                            </div>

                            {/* Message input */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#274451]" htmlFor="message">Message</label>
                                <textarea id="message" rows="5" className="w-full rounded-xl border border-[#D4E8EA] px-4 py-3 focus:border-[#29C7C9] focus:outline-none" required></textarea>
                            </div>

                            <button type="submit" className="rounded-full bg-[#29C7C9] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#22b6b7]">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}