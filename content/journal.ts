/** Strony z `public/journal/` — 3007–3018, pominięte brakujące pliki. */
const JOURNAL_NUMBERS = [
  3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3016, 3018,
] as const;

export const journalSpreads = JOURNAL_NUMBERS.map((n) => ({
  n,
  src: `/journal/IMG_${n}.webp`,
}));

export const journalPages = journalSpreads.map((item) => item.src);
