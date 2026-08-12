"use client";

import { useState } from "react";
import { ScriptureEntry, Volume, Topic } from "@/lib/types";
import { VOLUME_ORDER, getBooksForVolume } from "@/lib/scriptureOrder";
import QuoteListEditor from "./QuoteListEditor";

const BLANK: ScriptureEntry = {
  id: "",
  volume: "Old Testament",
  book: getBooksForVolume("Old Testament")[0],
  chapter: 1,
  verse: "1",
  reference: "",
  context: "",
  ldsInterpretation: "",
  quotes: [],
  relatedTopicIds: [],
};

function slugId(reference: string) {
  return reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ScriptureForm({
  initial,
  allTopics,
  onSave,
  onCancel,
}: {
  initial?: ScriptureEntry;
  allTopics: Topic[];
  onSave: (entry: ScriptureEntry) => void;
  onCancel: () => void;
}) {
  const [entry, setEntry] = useState<ScriptureEntry>(initial ?? BLANK);

  const set = <K extends keyof ScriptureEntry>(key: K, value: ScriptureEntry[K]) =>
    setEntry((e) => ({ ...e, [key]: value }));

  const books = getBooksForVolume(entry.volume);

  const toggleTopic = (topicId: string) => {
    const current = entry.relatedTopicIds ?? [];
    set(
      "relatedTopicIds",
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId]
    );
  };

  const handleSave = () => {
    if (!entry.book || !entry.chapter || !entry.verse.trim()) {
      alert("Please fill in book, chapter, and verse.");
      return;
    }
    const reference =
      entry.reference.trim() ||
      (entry.volume === "Doctrine and Covenants"
        ? `Doctrine and Covenants ${entry.chapter}:${entry.verse}`
        : `${entry.book} ${entry.chapter}:${entry.verse}`);
    const id = entry.id.trim() || slugId(reference);
    onSave({ ...entry, reference, id });
  };

  return (
    <div className="space-y-4 rounded-lg border border-maroon-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div>
          <label className="text-xs font-semibold text-gray-500">Volume</label>
          <select
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            value={entry.volume}
            onChange={(e) => {
              const volume = e.target.value as Volume;
              set("volume", volume);
              set("book", getBooksForVolume(volume)[0]);
            }}
          >
            {VOLUME_ORDER.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Book</label>
          <select
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            value={entry.book}
            onChange={(e) => set("book", e.target.value)}
          >
            {books.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Chapter (or D&C section)</label>
          <input
            type="number"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            value={entry.chapter}
            onChange={(e) => set("chapter", parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Verse (e.g. 5 or 5-7)</label>
          <input
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            value={entry.verse}
            onChange={(e) => set("verse", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500">
          Display reference (leave blank to auto-generate)
        </label>
        <input
          className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          placeholder="e.g. Genesis 1:26"
          value={entry.reference}
          onChange={(e) => set("reference", e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500">Context</label>
        <textarea
          className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          rows={2}
          value={entry.context}
          onChange={(e) => set("context", e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500">LDS apologetic interpretation</label>
        <textarea
          className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          rows={3}
          value={entry.ldsInterpretation}
          onChange={(e) => set("ldsInterpretation", e.target.value)}
        />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-maroon-900">Quotations</h3>
        <QuoteListEditor
          quotes={entry.quotes}
          onChange={(v) => set("quotes", v)}
          idPrefix={entry.id || "scripture"}
        />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-maroon-900">Related topics</h3>
        <div className="flex flex-wrap gap-2">
          {allTopics.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => toggleTopic(t.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                (entry.relatedTopicIds ?? []).includes(t.id)
                  ? "border-maroon-600 bg-maroon-600 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={handleSave}
          className="rounded-md bg-maroon-700 px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-800"
        >
          Save scripture
        </button>
        <button
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
