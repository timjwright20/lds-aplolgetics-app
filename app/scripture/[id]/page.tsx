import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllScriptures, getScriptureById, getTopicsForScripture } from "@/lib/dataAccess";
import QuoteCard from "@/components/QuoteCard";

export function generateStaticParams() {
  return getAllScriptures().map((s) => ({ id: s.id }));
}

export default function ScripturePage({ params }: { params: { id: string } }) {
  const scripture = getScriptureById(params.id);
  if (!scripture) return notFound();
  const relatedTopics = getTopicsForScripture(scripture.id);

  return (
    <div>
      <Link href="/scripture" className="text-sm text-maroon-700 underline">
        &larr; Scripture index
      </Link>

      <h1 className="mt-2 text-3xl font-bold text-maroon-900">{scripture.reference}</h1>
      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
        {scripture.volume} &middot; {scripture.book}
      </p>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-maroon-900">Context</h2>
        <p className="text-gray-700">{scripture.context}</p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold text-maroon-900">LDS apologetic interpretation</h2>
        <p className="text-gray-700">{scripture.ldsInterpretation}</p>
      </section>

      {scripture.quotes.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-maroon-900">Supporting quotations</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {scripture.quotes.map((q) => (
              <QuoteCard key={q.id} quote={q} />
            ))}
          </div>
        </section>
      )}

      {relatedTopics.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold text-maroon-900">Related topics</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((t) => (
              <Link
                key={t.id}
                href={`/topics/${t.slug}`}
                className="rounded-full border border-maroon-200 bg-maroon-50 px-3 py-1 text-sm text-maroon-800 hover:bg-maroon-100"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
