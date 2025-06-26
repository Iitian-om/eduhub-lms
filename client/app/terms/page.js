export default function TermsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F7F9FA] py-8 px-2">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4 text-[#22292F]">Terms of Service</h1>
        <p className="mb-4 text-gray-700">By using EduHub LMS, you agree to the following terms and conditions:</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Use EduHub LMS for lawful purposes only.</li>
          <li>Respect the intellectual property of others.</li>
          <li>Do not attempt to disrupt or misuse the platform.</li>
          <li>EduHub LMS is not liable for user-generated content.</li>
        </ul>
        <p className="text-gray-600">For questions, contact us at <a href="mailto:support@eduhub.com" className="text-[#29C7C9] hover:underline">support@eduhub.com</a>.</p>
      </div>
    </div>
  );
}