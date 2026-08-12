import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTopics, getTopicBySlug } from "@/lib/dataAccess";
import QuoteCard from "@/components/QuoteCard";

export function generateStaticParams() {
  return getAllTopics().map((t) => ({ slug: t.slug }));
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) return notFound();

  return (
    <div>
      <Link href="/" className="text-sm text-maroon-700 underline">
        &larr; All topics
      </Link>

      <h1 className="mt-2 text-3xl font-bold text-maroon-900">{topic.name}</h1>
      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{topic.category}</p>
      <p className="mt-4 max-w-3xl text-gray-700">{topic.summary}</p>

      <Section title="Biblical scriptures (LDS-supportive reading)">
        <RefList refs={topic.biblicalScriptures} />
      </Section>

      <Section title="LDS scriptures (context and explanation)">
        <RefList refs={topic.ldsScriptures} />
      </Section>

      {topic.quotes.length > 0 && (
        <Section title="Quotations">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {topic.quotes.map((q) => (
              <QuoteCard key={q.id} quote={q} />
            ))}
          </div>
        </Section>
      )}

      {topic.subtopics.length > 0 && (
        <Section title="Subtopics">
          <div className="space-y-6">
            {topic.subtopics.map((sub) => (
              <div key={sub.id} id={sub.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-maroon-800">{sub.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{sub.content}</p>
                {sub.quotes && sub.quotes.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {sub.quotes.map((q) => (
                      <QuoteCard key={q.id} quote={q} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-maroon-900">{title}</h2>
      {children}
    </section>
  );
}

function RefList({ refs }: { refs: { reference: string; note?: string }[] }) {
  if (refs.length === 0) return <p className="text-sm text-gray-400">None added yet.</p>;
  return (
    <ul className="space-y-3">
      {refs.map((r, i) => (
        <li key={i} className="rounded-md border border-gray-200 bg-white p-3">
          <div className="font-semibold text-gray-900">{r.reference}</div>
          {r.note && <div className="mt-1 text-sm text-gray-600">{r.note}</div>}
        </li>
      ))}
    </ul>
  );
}
