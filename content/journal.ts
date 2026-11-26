/** Strony z `public/journal/` — 1–9 i 10a. */
const JOURNAL_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10a"] as const;

export const journalSpreads = JOURNAL_IDS.map((id) => ({
  id,
  src: `/journal/${id}.webp`,
}));

export const journalPages = journalSpreads.map((item) => item.src);
