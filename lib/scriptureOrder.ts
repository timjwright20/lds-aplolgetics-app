import { Volume } from "./types";

export const VOLUME_ORDER: Volume[] = [
  "Old Testament",
  "New Testament",
  "Book of Mormon",
  "Doctrine and Covenants",
  "Pearl of Great Price",
];

export const OLD_TESTAMENT_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges",
  "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes",
  "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
];

export const NEW_TESTAMENT_BOOKS = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
  "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation",
];

export const BOOK_OF_MORMON_BOOKS = [
  "1 Nephi", "2 Nephi", "Jacob", "Enos", "Jarom", "Omni", "Words of Mormon",
  "Mosiah", "Alma", "Helaman", "3 Nephi", "4 Nephi", "Mormon", "Ether", "Moroni",
];

export const PEARL_OF_GREAT_PRICE_BOOKS = [
  "Moses", "Abraham", "Joseph Smith—Matthew", "Joseph Smith—History", "Articles of Faith",
];

// Doctrine and Covenants is ordered purely by section number, plus the two
// Official Declarations which come after section 138.
export const DOCTRINE_AND_COVENANTS_BOOKS = ["Sections", "Official Declarations"];

export function getBooksForVolume(volume: Volume): string[] {
  switch (volume) {
    case "Old Testament":
      return OLD_TESTAMENT_BOOKS;
    case "New Testament":
      return NEW_TESTAMENT_BOOKS;
    case "Book of Mormon":
      return BOOK_OF_MORMON_BOOKS;
    case "Doctrine and Covenants":
      return DOCTRINE_AND_COVENANTS_BOOKS;
    case "Pearl of Great Price":
      return PEARL_OF_GREAT_PRICE_BOOKS;
  }
}

export function getBookOrder(volume: Volume, book: string): number {
  const books = getBooksForVolume(volume);
  const idx = books.indexOf(book);
  return idx === -1 ? books.length : idx;
}

export function getVolumeOrder(volume: Volume): number {
  return VOLUME_ORDER.indexOf(volume);
}

/**
 * Sort scripture entries in canonical order: volume, then book, then
 * chapter, then verse (numeric-aware).
 */
export function compareScriptureOrder(
  a: { volume: Volume; book: string; chapter: number; verse: string },
  b: { volume: Volume; book: string; chapter: number; verse: string }
): number {
  const volDiff = getVolumeOrder(a.volume) - getVolumeOrder(b.volume);
  if (volDiff !== 0) return volDiff;

  // D&C sorts by chapter (section) number regardless of "book" grouping.
  if (a.volume === "Doctrine and Covenants") {
    return a.chapter - b.chapter;
  }

  const bookDiff = getBookOrder(a.volume, a.book) - getBookOrder(b.volume, b.book);
  if (bookDiff !== 0) return bookDiff;

  const chapDiff = a.chapter - b.chapter;
  if (chapDiff !== 0) return chapDiff;

  const aVerseNum = parseInt(a.verse, 10) || 0;
  const bVerseNum = parseInt(b.verse, 10) || 0;
  return aVerseNum - bVerseNum;
}
