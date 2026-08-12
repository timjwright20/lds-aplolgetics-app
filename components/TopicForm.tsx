"use client";

import { useState } from "react";
import { Topic, Subtopic } from "@/lib/types";
import RefListEditor from "./RefListEditor";
import QuoteListEditor from "./QuoteListEditor";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const BLANK: Topic = {
  id: "",
  name: "",
  slug: "",
  category: "",
  summary: "",
  biblicalScriptures: [],
  ldsScriptures: [],
  quotes: [],
  subtopics: [],
};

export default function TopicForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Topic;
  onSave: (topic: Topic) => void;
  onCancel: () => void;
}) {
  const [topic, setTopic] = useState<Topic>(initial ?? BLANK);

  const set = <K extends keyof Topic>(key: K, value: Topic[K]) =>
    setTopic((t) => ({ ...t, [key]: value }));

  const updateSubtopic = (i: number, patch: Partial<Subtopic>) => {
    const next = topic.subtopics.slice();
    next[i] = { ...next[i], ...patch };
    set("subtopics", next);
  };
  const removeSubtopic = (i: number) =>
    set("subtopics", topic.subtopics.filter((_, idx) => idx !== i));
  const addSubtopic = () =>
    set("subtopics", [
      ...topic.subtopics,
      { id: `${topic.id || "sub"}-${Date.now().toString(36)}`, name: "", content: "", quotes: [] },
    ]);

  const handleSave = () => {
    const name = topic.name.trim();
    if (!name) {
      alert("Please enter a topic name.");
      return;
    }
    const slug = topic.slug.trim() || slugify(name);
    const id = topic.id.trim() || slug;
    onSave({ ...topic, id, slug, name });
  };

  return (
    <div className="space-y-4 rounded-lg border border-maroon-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-gray-500">Topic name</label>
          <input
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            value={topic.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Nature of God"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Category</label>
          <input
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            value={topic.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="e.g. Godhead & Exaltation"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500">Summary</label>
        <textarea
          className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          rows={3}
          value={topic.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-maroon-900">
          Biblical scriptures (LDS-supportive reading)
        </h3>
        <RefListEditor
          refs={topic.biblicalScriptures}
          onChange={(v) => set("biblicalScriptures", v)}
        />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-maroon-900">
          LDS scriptures (context and explanation)
        </h3>
        <RefListEditor refs={topic.ldsScriptures} onChange={(v) => set("ldsScriptures", v)} />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-maroon-900">Quotations</h3>
        <QuoteListEditor
          quotes={topic.quotes}
          onChange={(v) => set("quotes", v)}
          idPrefix={topic.id || "topic"}
        />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-maroon-900">Subtopics</h3>
        <div className="space-y-3">
          {topic.subtopics.map((sub, i) => (
            <div key={sub.id} className="rounded-md border border-gray-200 p-3">
              <input
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                placeholder="Subtopic name"
                value={sub.name}
                onChange={(e) => updateSubtopic(i, { name: e.target.value })}
              />
              <textarea
                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                rows={3}
                placeholder="Subtopic content"
                value={sub.content}
                onChange={(e) => updateSubtopic(i, { content: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removeSubtopic(i)}
                className="mt-2 text-xs font-medium text-red-600 hover:underline"
              >
                Remove subtopic
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubtopic}
            className="rounded-md border border-dashed border-maroon-300 px-3 py-1.5 text-sm text-maroon-700 hover:bg-maroon-50"
          >
            + Add subtopic
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={handleSave}
          className="rounded-md bg-maroon-700 px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-800"
        >
          Save topic
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
