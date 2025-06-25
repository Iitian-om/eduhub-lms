"use client"

export default function ContactPage() {

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="mb-2">We would love to hear from you! Please fill out the form below to get in touch with us.</p>
            <form className="space-y-4">
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Send Message
                </button>
            </form>
        </div>
    );
}