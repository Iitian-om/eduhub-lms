export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F7F9FA] py-8 px-2">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4 text-[#22292F]">Privacy Policy</h1>
        <p className="mb-4 text-gray-700">Your privacy is important to us. This Privacy Policy explains how EduHub LMS collects, uses, and protects your information.</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>We collect only necessary information to provide our services.</li>
          <li>Your data is never sold to third parties.</li>
          <li>We use cookies for authentication and improving user experience.</li>
          <li>You can contact us anytime to request data deletion.</li>
        </ul>
        <p className="text-gray-600">For more details, contact us at <a href="mailto:support@eduhub.com" className="text-[#29C7C9] hover:underline">support@eduhub.com</a>.</p>
      </div>
    </div>
  );
} 