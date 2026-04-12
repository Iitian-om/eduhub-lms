export default function TermsPage() {
  return (
    <main className="min-h-[90vh] bg-[#F4FAFA] px-4 py-12 text-[#22313A] sm:px-6 lg:px-8">
      {/* Terms hero */}
      <section className="mx-auto mb-8 w-full max-w-5xl rounded-3xl border border-[#CFE9EA] bg-gradient-to-br from-[#EAF8F8] via-white to-[#ECF6FF] p-8 shadow-sm sm:p-10">
        <p className="inline-block rounded-full border border-[#BFE9EA] bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#2B5665]">
          Legal
        </p>
        <h1 className="mt-4 text-4xl font-bold text-[#1B2A33] md:text-5xl">Terms of Service</h1>
        <p className="mt-3 max-w-3xl text-[#4A6572]">
          By using EduHub LMS, you agree to these terms. They are intended to keep the platform safe, reliable, and fair for all users.
        </p>
      </section>

      {/* Terms sections */}
      <section className="mx-auto w-full max-w-5xl space-y-5">
        <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">Acceptable Use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[#4A6572]">
            <li>Use the platform only for lawful educational purposes.</li>
            <li>Do not attempt to abuse, disrupt, or compromise system functionality.</li>
            <li>Follow role-based permissions and moderation policies.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">Content and Intellectual Property</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[#4A6572]">
            <li>Respect copyrights and ownership of all uploaded materials.</li>
            <li>Only upload content you are authorized to share.</li>
            <li>EduHub may remove content that violates policy or legal requirements.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-[#D7ECEE] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1B2A33]">Liability and Changes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[#4A6572]">
            <li>User-generated content remains the responsibility of the uploader.</li>
            <li>Platform features may evolve as EduHub scales from capstone to MVP.</li>
            <li>Terms may be updated periodically, with changes reflected on this page.</li>
          </ul>
          <p className="mt-4 text-[#4A6572]">
            For terms-related questions, contact <a href="mailto:support@eduhub.com" className="font-semibold text-[#178E90] hover:underline">support@eduhub.com</a>.
          </p>
        </article>
      </section>
    </main>
  );
}