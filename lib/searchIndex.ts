import { getAllTopics, getAllScriptures } from "./dataAccess";

export type SearchRecordType = "topic" | "subtopic" | "scripture" | "quote";

export interface SearchRecord {
  id: string;
  type: SearchRecordType;
  title: string;
  snippet: string;
  href: string;
  author?: string;
}

export function buildSearchIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];

  for (const topic of getAllTopics()) {
    records.push({
      id: `topic-${topic.id}`,
      type: "topic",
      title: topic.name,
      snippet: topic.summary,
      href: `/topics/${topic.slug}`,
    });

    for (const sub of topic.subtopics) {
      records.push({
        id: `subtopic-${sub.id}`,
        type: "subtopic",
        title: `${topic.name} — ${sub.name}`,
        snippet: sub.content,
        href: `/topics/${topic.slug}#${sub.id}`,
      });
    }

    for (const q of topic.quotes) {
      records.push({
        id: `quote-${q.id}`,
        type: "quote",
        title: `${q.author} on ${topic.name}`,
        snippet: q.text,
        href: `/topics/${topic.slug}#${q.id}`,
        author: q.author,
      });
    }

    for (const sub of topic.subtopics) {
      for (const q of sub.quotes ?? []) {
        records.push({
          id: `quote-${q.id}`,
          type: "quote",
          title: `${q.author} on ${sub.name}`,
          snippet: q.text,
          href: `/topics/${topic.slug}#${q.id}`,
          author: q.author,
        });
      }
    }
  }

  for (const scripture of getAllScriptures()) {
    records.push({
      id: `scripture-${scripture.id}`,
      type: "scripture",
      title: scripture.reference,
      snippet: scripture.ldsInterpretation,
      href: `/scripture/${scripture.id}`,
    });

    for (const q of scripture.quotes) {
      records.push({
        id: `quote-${q.id}-${scripture.id}`,
        type: "quote",
        title: `${q.author} on ${scripture.reference}`,
        snippet: q.text,
        href: `/scripture/${scripture.id}#${q.id}`,
        author: q.author,
      });
    }
  }

  return records;
}
