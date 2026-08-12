"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Topic } from "@/lib/types";

export default function TopicGrid({
  topics,
  categories,
}: {
  topics: Topic[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return topics
      .filter((t) => category === "All" || t.category === category)
      .filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [topics, category, query]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Quick filter by topic name..."
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-maroon-600 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-maroon-600 focus:outline-none"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No topics match that filter yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="rounded-lg border border-maroon-100 bg-white px-4 py-3 shadow-sm transition hover:border-maroon-600 hover:shadow-md"
            >
              <div className="font-semibold text-maroon-900">{topic.name}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                {topic.category}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
