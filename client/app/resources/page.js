import Link from "next/link";

export default function ResourcesPage() {
  const collections = [
    {
      title: "Notes",
      description: "Class notes, summaries, and revision material.",
      href: "/notes",
    },
    {
      title: "Books",
      description: "Academic books and reference documents.",
      href: "/books",
    },
    {
      title: "Research Papers",
      description: "Research-focused papers and scholarly resources.",
      href: "/research-papers",
    },
  ];

  return (
    <main className="min-h-[80vh] bg-[#F4FAFA] px-4 py-12 text-[#22313A] sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#178E90]">Resource Hub</p>
          <h1 className="mt-2 text-4xl font-bold text-[#1B2A33]">Explore Learning Resources</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[#4A6572]">
            Browse curated educational resources organized by content type.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {collections.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#DBF1F2] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1B2A33]">{item.title}</h2>
              <p className="mt-2 text-[#4A6572]">{item.description}</p>
              <Link
                href={item.href}
                className="mt-4 inline-block rounded-full bg-[#29C7C9] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1EAEB0]"
              >
                Open {item.title}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
