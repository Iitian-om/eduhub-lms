export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[90vh] bg-[#F4FAFA] px-4 py-12 text-[#22313A] sm:px-6 lg:px-8">
      {/* Privacy hero */}
      <section className="mx-auto mb-8 w-full max-w-5xl rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm sm:p-10">
        <p className="inline-block rounded-full border border-[#BFE9EA] bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#2B5665]">
          Legal
        </p>
        <h1 className="mt-4 text-4xl font-bold text-[#1B2A33] md:text-5xl">Privacy Policy</h1>
        <p className="mt-3 max-w-3xl text-[#4A6572]">
          Your privacy matters to us. This policy explains what data we collect, how we use it, and how we protect your information.
        </p>
      </section>

      {/* Privacy sections */}
      <section className="mx-auto w-full max-w-5xl space-y-5">
        <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[#4A6572]">
            <li>Account details such as name, username, and email.</li>
            <li>Profile and platform usage information needed to deliver core features.</li>
            <li>Content metadata related to notes, books, and research resource workflows.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">How We Use Data</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[#4A6572]">
            <li>Provide authentication, role-based access, and account management.</li>
            <li>Improve resource discovery, moderation quality, and user experience.</li>
            <li>Maintain platform security, reliability, and auditability.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">Data Protection and Control</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[#4A6572]">
            <li>Your data is not sold to third parties.</li>
            <li>Cookies may be used for secure sessions and essential functionality.</li>
            <li>You can contact support to request account data updates or deletion guidance.</li>
          </ul>
          <p className="mt-4 text-[#4A6572]">
            For privacy-related requests, contact <a href="mailto:support@eduhub.com" className="font-semibold text-[#178E90] hover:underline">support@eduhub.com</a>.
          </p>
        </article>
      </section>
    </main>
  );
} 