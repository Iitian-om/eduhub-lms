"use client"
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F7F9FA] py-8 px-2">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow">
                <h1 className="text-3xl font-bold mb-4 text-[#22292F]">Contact Us</h1>
                <p className="mb-2 text-gray-700">We would love to hear from you! Please fill out the form below to get in touch with us.</p>
                {submitted ? (
                    <div className="bg-green-100 text-green-700 p-4 rounded mb-4">Thank you for contacting us! We'll get back to you soon.</div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                            <input type="text" id="name" className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input type="email" id="email" className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                            <textarea id="message" rows="4" className="w-full px-3 py-2 border rounded" required></textarea>
                        </div>
                        <button type="submit" className="bg-[#29C7C9] text-white px-4 py-2 rounded hover:bg-[#22b6b7]">Send Message</button>
                    </form>
                )}
            </div>
        </div>
    );
}