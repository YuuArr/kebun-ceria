/**
 * Phonics order (easiest sounds first), not A–Z. Vowels first, then frequent consonants.
 * Age 2–3 uses the first 5 (vowels); age 4–5 uses all.
 */
export const LETTER_ORDER = [
  'A', 'I', 'U', 'E', 'O', 'M', 'B', 'P', 'S', 'T', 'K', 'N', 'L', 'D',
  'G', 'R', 'H', 'J', 'C', 'W', 'Y', 'F', 'Z', 'V', 'X', 'Q',
] as const;

/** How many letters (from the start of LETTER_ORDER) each stage uses. */
export const LETTER_STAGES = [5, 9, 14, 26] as const;

/** Letters in play for an age group and level (0–3). Opens gradually: vowels, common consonants, then A–Z. */
export function letterPool(age: '2-3' | '4-5', level = 0, all = false): Letter[] {
  if (all) return [...LETTER_ORDER];
  if (age === '2-3') return LETTER_ORDER.slice(0, level >= 2 ? 7 : 5);
  return LETTER_ORDER.slice(0, [9, 14, 26, 26][Math.min(3, level)]);
}
export type Letter = (typeof LETTER_ORDER)[number];

/** Indonesian letter names, used for speech fallback. */
export const LETTER_NAMES: Record<Letter, string> = {
  A: 'a', I: 'i', U: 'u', E: 'e', O: 'o', M: 'em', B: 'be', P: 'pe', S: 'es', T: 'te',
  K: 'ka', N: 'en', L: 'el', D: 'de',
  G: 'ge', R: 'er', H: 'ha', J: 'je', C: 'ce', W: 'we', Y: 'ye', F: 'ef', Z: 'zet', V: 've', X: 'eks', Q: 'ki',
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
  G: { tts: 'geh', note: 'bunyi /g/ pendek, bukan "ge"' },
  R: { tts: 'rrr', note: 'bunyi /r/ bergetar, bukan "er"' },
  H: { tts: 'hhh', note: 'bunyi /h/ berhembus, bukan "ha"' },
  J: { tts: 'jeh', note: 'bunyi /j/ pendek, bukan "je"' },
  C: { tts: 'ceh', note: 'bunyi /c/ pendek seperti di "cicak", bukan "ce"' },
  W: { tts: 'weh', note: 'bunyi /w/ pendek, bukan "we"' },
  Y: { tts: 'yeh', note: 'bunyi /y/ pendek, bukan "ye"' },
  F: { tts: 'fff', note: 'bunyi /f/ berhembus, bukan "ef"' },
  Z: { tts: 'zzz', note: 'bunyi /z/ berdengung, bukan "zet"' },
  V: { tts: 'fff', note: 'bunyi /v/ (dibaca seperti /f/), bukan "ve"' },
  X: { tts: 'ks', note: 'bunyi /ks/ seperti di "xilofon" (dibaca "silofon"); boleh /s/' },
  Q: { tts: 'keh', note: 'bunyi /k/, bukan "ki"' },
};
