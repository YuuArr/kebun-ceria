/**
 * Phonics order (easiest sounds first), not A–Z. Vowels first, then frequent consonants.
 * Age 2–3 uses the first 5 (vowels); age 4–5 uses all.
 */
export const LETTER_ORDER = ['A', 'I', 'U', 'E', 'O', 'M', 'B', 'P', 'S', 'T', 'K', 'N', 'L', 'D'] as const;
export type Letter = (typeof LETTER_ORDER)[number];

/** Indonesian letter names, used for speech fallback. */
export const LETTER_NAMES: Record<Letter, string> = {
  A: 'a', I: 'i', U: 'u', E: 'e', O: 'o', M: 'em', B: 'be', P: 'pe', S: 'es', T: 'te',
  K: 'ka', N: 'en', L: 'el', D: 'de',
};

/** How the pure sound should be recorded (for the voice script). */
export const LETTER_SOUNDS: Record<Letter, { tts: string; note: string }> = {
  A: { tts: 'a', note: 'bunyi /a/ seperti di "apel"' },
  I: { tts: 'i', note: 'bunyi /i/ seperti di "ikan"' },
  U: { tts: 'u', note: 'bunyi /u/ seperti di "ulat"' },
  E: { tts: 'e', note: 'bunyi /e/ seperti di "ember"' },
  O: { tts: 'o', note: 'bunyi /o/ seperti di "obor"' },
  M: { tts: 'mmm', note: 'bunyi /m/ didengungkan, bukan "em"' },
  B: { tts: 'beh', note: 'bunyi /b/ pendek, bukan "be"' },
  P: { tts: 'peh', note: 'bunyi /p/ pendek dan berhembus, bukan "pe"' },
  S: { tts: 'sss', note: 'bunyi /s/ mendesis, bukan "es"' },
  T: { tts: 'teh', note: 'bunyi /t/ pendek, bukan "te"' },
  K: { tts: 'keh', note: 'bunyi /k/ pendek, bukan "ka"' },
  N: { tts: 'nnn', note: 'bunyi /n/ didengungkan, bukan "en"' },
  L: { tts: 'lll', note: 'bunyi /l/ ditahan, bukan "el"' },
  D: { tts: 'deh', note: 'bunyi /d/ pendek, bukan "de"' },
};
