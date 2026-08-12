"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { buildSearchIndex, SearchRecord, SearchRecordType } from "@/lib/searchIndex";

const TYPE_LABELS: Record<SearchRecordType, string> = {
  topic: "Topic",
  subtopic: "Subtopic",
  scripture: "Scripture",
  quote: "Quote",
};

const TYPE_COLORS: Record<SearchRecordType, string> = {
  topic: "bg-maroon-100 text-maroon-800",
  subtopic: "bg-maroon-100 text-maroon-800",
  scripture: "bg-blue-100 text-blue-900",
  quote: "bg-amber-100 text-amber-900",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | SearchRecordType>("all");

  const index = useMemo(() => buildSearchIndex(), []);
  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 0.4 },
          { name: "snippet", weight: 0.3 },
          { name: "author", weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [index]
  );

  const results: SearchRecord[] = useMemo(() => {
    let base: SearchRecord[];
    if (query.trim().length === 0) {
      base = index;
    } else {
      base = fuse.search(query).map((r) => r.item);
    }
    return typeFilter === "all" ? base : base.filter((r) => r.type === typeFilter);
  }, [query, fuse, index, typeFilter]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-maroon-900">Search Everything</h1>
      <p className="mb-6 text-sm text-gray-600">
        Search across topics, scriptures, and quotations at once. Try an author&rsquo;s last name
        (e.g. &ldquo;Athanasius&rdquo;), a subject (e.g. &ldquo;baptism&rdquo;), or a scripture
        reference.
      </p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword, subject, or author last name..."
          className="w-full max-w-lg rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-maroon-600 focus:outline-none"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-maroon-600 focus:outline-none"
        >
          <option value="all">All types</option>
          <option value="topic">Topics</option>
          <option value="scripture">Scriptures</option>
          <option value="quote">Quotes</option>
        </select>
      </div>

      <div className="space-y-3">
        {results.length === 0 && (
          <p className="text-gray-500">No results. Try a different term.</p>
        )}
        {results.slice(0, 100).map((r) => (
          <Link
            key={r.id}
            href={r.href}
            className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-maroon-400"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[r.type]}`}>
                {TYPE_LABELS[r.type]}
              </span>
              <span className="font-semibold text-gray-900">{r.title}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{r.snippet}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
