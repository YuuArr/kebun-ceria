import type { ArtId } from '../art/things';
import { LETTER_ORDER, letterPool, type Letter } from './letters';

export interface Word {
  word: string;
  letter: Letter;
  art: ArtId;
}

/** One familiar picture word per letter, in phonics order. */
export const WORDS: readonly Word[] = [
  { word: 'apel', letter: 'A', art: 'apel' },
  { word: 'ikan', letter: 'I', art: 'ikan' },
  { word: 'ular', letter: 'U', art: 'ular' },
  { word: 'ember', letter: 'E', art: 'ember' },
  { word: 'ombak', letter: 'O', art: 'ombak' },
  { word: 'mobil', letter: 'M', art: 'mobil' },
  { word: 'bola', letter: 'B', art: 'bola' },
  { word: 'pisang', letter: 'P', art: 'pisang' },
  { word: 'susu', letter: 'S', art: 'susu' },
  { word: 'topi', letter: 'T', art: 'topi' },
  { word: 'kucing', letter: 'K', art: 'kucing' },
  { word: 'nanas', letter: 'N', art: 'nanas' },
  { word: 'lampu', letter: 'L', art: 'lampu' },
  { word: 'daun', letter: 'D', art: 'daun' },
  { word: 'gajah', letter: 'G', art: 'gajah' },
  { word: 'roti', letter: 'R', art: 'roti' },
  { word: 'hati', letter: 'H', art: 'hati' },
  { word: 'jeruk', letter: 'J', art: 'jeruk' },
  { word: 'cicak', letter: 'C', art: 'cicak' },
  { word: 'wortel', letter: 'W', art: 'wortel' },
  { word: 'yoyo', letter: 'Y', art: 'yoyo' },
  { word: 'foto', letter: 'F', art: 'foto' },
  { word: 'zebra', letter: 'Z', art: 'zebra' },
  { word: 'vas', letter: 'V', art: 'vas' },
  { word: 'xilofon', letter: 'X', art: 'xilofon' },
];

/** Letters that have a picture word (Q has none: no common child word starts with Q). */
export const WORD_LETTERS = WORDS.map((w) => w.letter);

export const wordFor = (l: Letter): Word | undefined => WORDS.find((w) => w.letter === l);
/** Picture words whose letter is in play for this age/level. */
export function wordPool(age: '2-3' | '4-5', level = 0): Word[] {
  const letters = letterPool(age, level);
  return WORDS.filter((w) => letters.includes(w.letter));
}

export const VOWEL_WORDS = WORDS.filter((w) => LETTER_ORDER.indexOf(w.letter) < 5);
