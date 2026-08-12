"use client";

import { Quote, AuthorType, AUTHOR_TYPE_LABELS } from "@/lib/types";

function slugId(prefix: string, text: string) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
  return `${prefix}-${base || Math.random().toString(36).slice(2, 8)}-${Date.now()
    .toString(36)
    .slice(-4)}`;
}

export default function QuoteListEditor({
  quotes,
  onChange,
  idPrefix,
}: {
  quotes: Quote[];
  onChange: (quotes: Quote[]) => void;
  idPrefix: string;
}) {
  const update = (i: number, patch: Partial<Quote>) => {
    const next = quotes.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(quotes.filter((_, idx) => idx !== i));
  };

  const add = () => {
    onChange([
      ...quotes,
      {
        id: slugId(idPrefix, "quote"),
        author: "",
        authorType: "lds_apologist",
        text: "",
        source: "",
      },
    ]);
  };

  return (
    <div className="space-y-3">
      {quotes.map((q, i) => (
        <div key={q.id} className="rounded-md border border-gray-200 p-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Author (e.g. Hugh Nibley)"
              value={q.author}
              onChange={(e) => update(i, { author: e.target.value })}
            />
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              value={q.authorType}
              onChange={(e) => update(i, { authorType: e.target.value as AuthorType })}
            >
              {Object.entries(AUTHOR_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder="Quote text (short excerpt, 1-3 sentences)"
            rows={2}
            value={q.text}
            onChange={(e) => update(i, { text: e.target.value })}
          />
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Source / citation"
              value={q.source}
              onChange={(e) => update(i, { source: e.target.value })}
            />
            <input
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Year (optional)"
              value={q.year ?? ""}
              onChange={(e) => update(i, { year: e.target.value })}
            />
            <input
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="URL (optional)"
              value={q.url ?? ""}
              onChange={(e) => update(i, { url: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="mt-2 text-xs font-medium text-red-600 hover:underline"
          >
            Remove quote
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-dashed border-maroon-300 px-3 py-1.5 text-sm text-maroon-700 hover:bg-maroon-50"
      >
        + Add quote
      </button>
    </div>
  );
}
