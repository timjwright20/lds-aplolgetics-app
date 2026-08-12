export type Volume =
  | "Old Testament"
  | "New Testament"
  | "Book of Mormon"
  | "Doctrine and Covenants"
  | "Pearl of Great Price";

export type AuthorType =
  | "church_father"
  | "lds_leader"
  | "lds_apologist"
  | "non_mormon_theologian"
  | "other";

export const AUTHOR_TYPE_LABELS: Record<AuthorType, string> = {
  church_father: "Early Church Father",
  lds_leader: "LDS Church Leader",
  lds_apologist: "LDS Apologist / Scholar",
  non_mormon_theologian: "Non-LDS Theologian / Scholar",
  other: "Other Source",
};

export interface Quote {
  id: string;
  author: string;
  authorType: AuthorType;
  text: string;
  source: string;
  url?: string;
  year?: string;
}

export interface ScriptureRef {
  reference: string;
  note?: string;
}

export interface Subtopic {
  id: string;
  name: string;
  content: string;
  quotes?: Quote[];
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  biblicalScriptures: ScriptureRef[];
  ldsScriptures: ScriptureRef[];
  quotes: Quote[];
  subtopics: Subtopic[];
  relatedScriptureIds?: string[];
}

export interface ScriptureEntry {
  id: string;
  volume: Volume;
  book: string;
  chapter: number;
  verse: string;
  reference: string;
  context: string;
  ldsInterpretation: string;
  quotes: Quote[];
  relatedTopicIds?: string[];
}
