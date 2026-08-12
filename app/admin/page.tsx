"use client";

import { useEffect, useState } from "react";
import topicsSeed from "@/data/topics.json";
import scripturesSeed from "@/data/scriptures.json";
import { Topic, ScriptureEntry } from "@/lib/types";
import { compareScriptureOrder } from "@/lib/scriptureOrder";
import TopicForm from "@/components/TopicForm";
import ScriptureForm from "@/components/ScriptureForm";

const TOPICS_DRAFT_KEY = "lds-apologetics-admin-topics-draft";
const SCRIPTURES_DRAFT_KEY = "lds-apologetics-admin-scriptures-draft";

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const [tab, setTab] = useState<"topics" | "scriptures">("topics");
  const [topics, setTopics] = useState<Topic[]>(topicsSeed as Topic[]);
  const [scriptures, setScriptures] = useState<ScriptureEntry[]>(scripturesSeed as ScriptureEntry[]);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [addingTopic, setAddingTopic] = useState(false);
  const [editingScripture, setEditingScripture] = useState<ScriptureEntry | null>(null);
  const [addingScripture, setAddingScripture] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(TOPICS_DRAFT_KEY);
    const s = localStorage.getItem(SCRIPTURES_DRAFT_KEY);
    if (t) setTopics(JSON.parse(t));
    if (s) setScriptures(JSON.parse(s));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(TOPICS_DRAFT_KEY, JSON.stringify(topics));
  }, [topics, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(SCRIPTURES_DRAFT_KEY, JSON.stringify(scriptures));
  }, [scriptures, loaded]);

  const saveTopic = (topic: Topic) => {
    setTopics((prev) => {
      const exists = prev.some((t) => t.id === topic.id);
      const next = exists ? prev.map((t) => (t.id === topic.id ? topic : t)) : [...prev, topic];
      return next.sort((a, b) => a.name.localeCompare(b.name));
    });
    setEditingTopic(null);
    setAddingTopic(false);
  };

  const deleteTopic = (id: string) => {
    if (!confirm("Remove this topic from your working draft?")) return;
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const saveScripture = (entry: ScriptureEntry) => {
    setScriptures((prev) => {
      const exists = prev.some((s) => s.id === entry.id);
      const next = exists ? prev.map((s) => (s.id === entry.id ? entry : s)) : [...prev, entry];
      return next.sort(compareScriptureOrder);
    });
    setEditingScripture(null);
    setAddingScripture(false);
  };

  const deleteScripture = (id: string) => {
    if (!confirm("Remove this scripture from your working draft?")) return;
    setScriptures((prev) => prev.filter((s) => s.id !== id));
  };

  const resetDrafts = () => {
    if (!confirm("Discard your unsaved changes and reload the data shipped in the repo?")) return;
    localStorage.removeItem(TOPICS_DRAFT_KEY);
    localStorage.removeItem(SCRIPTURES_DRAFT_KEY);
    setTopics(topicsSeed as Topic[]);
    setScriptures(scripturesSeed as ScriptureEntry[]);
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-maroon-900">Add / Edit Content</h1>
      <p className="mb-4 max-w-2xl text-sm text-gray-600">
        Changes here are saved in your browser as a working draft, but the live site only updates
        once you export the updated file(s) below and replace{" "}
        <code className="rounded bg-gray-100 px-1">data/topics.json</code> and/or{" "}
        <code className="rounded bg-gray-100 px-1">data/scriptures.json</code> in your project,
        then commit and push to GitHub (Vercel will redeploy automatically).
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => download("topics.json", topics)}
          className="rounded-md bg-maroon-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-maroon-800"
        >
          Export topics.json
        </button>
        <button
          onClick={() => download("scriptures.json", scriptures)}
          className="rounded-md bg-maroon-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-maroon-800"
        >
          Export scriptures.json
        </button>
        <button
          onClick={resetDrafts}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Discard draft / reload from repo
        </button>
      </div>

      <div className="mb-4 flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setTab("topics")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "topics" ? "border-b-2 border-maroon-700 text-maroon-900" : "text-gray-500"
          }`}
        >
          Topics ({topics.length})
        </button>
        <button
          onClick={() => setTab("scriptures")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "scriptures" ? "border-b-2 border-maroon-700 text-maroon-900" : "text-gray-500"
          }`}
        >
          Scriptures ({scriptures.length})
        </button>
      </div>

      {tab === "topics" && (
        <div className="space-y-4">
          {!addingTopic && !editingTopic && (
            <button
              onClick={() => setAddingTopic(true)}
              className="rounded-md bg-maroon-900 px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-800"
            >
              + Add new topic
            </button>
          )}
          {addingTopic && (
            <TopicForm onSave={saveTopic} onCancel={() => setAddingTopic(false)} />
          )}
          {editingTopic && (
            <TopicForm
              initial={editingTopic}
              onSave={saveTopic}
              onCancel={() => setEditingTopic(null)}
            />
          )}
          {!addingTopic && !editingTopic && (
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
              {topics
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((t) => (
                  <li key={t.id} className="flex items-center justify-between px-4 py-2">
                    <div>
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.category}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTopic(t)}
                        className="text-sm text-maroon-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTopic(t.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      {tab === "scriptures" && (
        <div className="space-y-4">
          {!addingScripture && !editingScripture && (
            <button
              onClick={() => setAddingScripture(true)}
              className="rounded-md bg-maroon-900 px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-800"
            >
              + Add new scripture
            </button>
          )}
          {addingScripture && (
            <ScriptureForm allTopics={topics} onSave={saveScripture} onCancel={() => setAddingScripture(false)} />
          )}
          {editingScripture && (
            <ScriptureForm
              initial={editingScripture}
              allTopics={topics}
              onSave={saveScripture}
              onCancel={() => setEditingScripture(null)}
            />
          )}
          {!addingScripture && !editingScripture && (
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
              {scriptures
                .slice()
                .sort(compareScriptureOrder)
                .map((s) => (
                  <li key={s.id} className="flex items-center justify-between px-4 py-2">
                    <div>
                      <div className="font-medium text-gray-900">{s.reference}</div>
                      <div className="text-xs text-gray-400">{s.volume}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingScripture(s)}
                        className="text-sm text-maroon-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteScripture(s.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
