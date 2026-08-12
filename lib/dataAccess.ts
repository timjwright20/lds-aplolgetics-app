import topicsData from "@/data/topics.json";
import scripturesData from "@/data/scriptures.json";
import { Topic, ScriptureEntry, Volume } from "./types";
import { compareScriptureOrder, VOLUME_ORDER, getBookOrder } from "./scriptureOrder";

const topics = topicsData as Topic[];
const scriptures = scripturesData as ScriptureEntry[];

export function getAllTopics(): Topic[] {
  return [...topics].sort((a, b) => a.name.localeCompare(b.name));
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getAllCategories(): string[] {
  const set = new Set(topics.map((t) => t.category));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getAllScriptures(): ScriptureEntry[] {
  return [...scriptures].sort(compareScriptureOrder);
}

export function getScriptureById(id: string): ScriptureEntry | undefined {
  return scriptures.find((s) => s.id === id);
}

export interface ScriptureTree {
  volume: Volume;
  books: {
    book: string;
    entries: ScriptureEntry[];
  }[];
}

export function getScriptureTree(): ScriptureTree[] {
  const sorted = getAllScriptures();
  return VOLUME_ORDER.map((volume) => {
    const volEntries = sorted.filter((s) => s.volume === volume);
    const bookNames = Array.from(new Set(volEntries.map((s) => s.book))).sort(
      (a, b) => getBookOrder(volume, a) - getBookOrder(volume, b)
    );
    return {
      volume,
      books: bookNames.map((book) => ({
        book,
        entries: volEntries.filter((s) => s.book === book),
      })),
    };
  }).filter((v) => v.books.length > 0);
}

export function getTopicsForScripture(scriptureId: string): Topic[] {
  const scripture = getScriptureById(scriptureId);
  if (!scripture?.relatedTopicIds) return [];
  return topics.filter((t) => scripture.relatedTopicIds!.includes(t.id));
}
