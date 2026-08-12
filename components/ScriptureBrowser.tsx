"use client";

import { useState } from "react";
import Link from "next/link";
import { ScriptureTree } from "@/lib/dataAccess";

export default function ScriptureBrowser({ tree }: { tree: ScriptureTree[] }) {
  const [openVolumes, setOpenVolumes] = useState<Record<string, boolean>>(
    Object.fromEntries(tree.map((v) => [v.volume, true]))
  );
  const [openBooks, setOpenBooks] = useState<Record<string, boolean>>({});

  const toggleVolume = (v: string) =>
    setOpenVolumes((s) => ({ ...s, [v]: !s[v] }));
  const toggleBook = (key: string) =>
    setOpenBooks((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-4">
      {tree.map((vol) => (
        <div key={vol.volume} className="rounded-lg border border-maroon-100 bg-white">
          <button
            onClick={() => toggleVolume(vol.volume)}
            className="flex w-full items-center justify-between px-4 py-3 text-left font-bold text-maroon-900"
          >
            <span>{vol.volume}</span>
            <span className="text-sm text-gray-400">{openVolumes[vol.volume] ? "−" : "+"}</span>
          </button>
          {openVolumes[vol.volume] && (
            <div className="divide-y divide-gray-100 border-t border-gray-100">
              {vol.books.map((b) => {
                const key = `${vol.volume}-${b.book}`;
                return (
                  <div key={key} className="px-4 py-2">
                    <button
                      onClick={() => toggleBook(key)}
                      className="flex w-full items-center justify-between py-1 text-left font-medium text-gray-800"
                    >
                      <span>{b.book}</span>
                      <span className="text-xs text-gray-400">
                        {openBooks[key] ? "−" : "+"} ({b.entries.length})
                      </span>
                    </button>
                    {openBooks[key] && (
                      <ul className="ml-3 mt-1 space-y-1 pb-2">
                        {b.entries.map((e) => (
                          <li key={e.id}>
                            <Link
                              href={`/scripture/${e.id}`}
                              className="text-sm text-maroon-700 hover:underline"
                            >
                              {e.reference}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
