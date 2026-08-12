import { Quote, AUTHOR_TYPE_LABELS } from "@/lib/types";

const BADGE_COLORS: Record<string, string> = {
  church_father: "bg-amber-100 text-amber-900",
  lds_leader: "bg-maroon-100 text-maroon-800",
  lds_apologist: "bg-blue-100 text-blue-900",
  non_mormon_theologian: "bg-emerald-100 text-emerald-900",
  other: "bg-gray-100 text-gray-800",
};

export default function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div id={quote.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[0.95rem] leading-relaxed text-gray-800">&ldquo;{quote.text}&rdquo;</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-gray-900">{quote.author}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            BADGE_COLORS[quote.authorType] ?? BADGE_COLORS.other
          }`}
        >
          {AUTHOR_TYPE_LABELS[quote.authorType]}
        </span>
        {quote.year && <span className="text-gray-500">{quote.year}</span>}
      </div>
      <p className="mt-1 text-xs italic text-gray-500">
        {quote.url ? (
          <a href={quote.url} target="_blank" rel="noreferrer" className="underline hover:text-maroon-700">
            {quote.source}
          </a>
        ) : (
          quote.source
        )}
      </p>
    </div>
  );
}
