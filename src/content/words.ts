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
  // Second and third words, so each letter has variety.
  { word: 'ayam', letter: 'A', art: 'ayam' },
  { word: 'anggur', letter: 'A', art: 'anggur' },
  { word: 'itik', letter: 'I', art: 'bebek' },
  { word: 'udang', letter: 'U', art: 'udang' },
  { word: 'es krim', letter: 'E', art: 'es-krim' },
  { word: 'obeng', letter: 'O', art: 'obeng' },
  { word: 'monyet', letter: 'M', art: 'monyet' },
  { word: 'mangga', letter: 'M', art: 'mangga' },
  { word: 'buku', letter: 'B', art: 'buku' },
  { word: 'balon', letter: 'B', art: 'balon' },
  { word: 'payung', letter: 'P', art: 'payung' },
  { word: 'pizza', letter: 'P', art: 'pizza' },
  { word: 'sapi', letter: 'S', art: 'sapi' },
  { word: 'stroberi', letter: 'S', art: 'stroberi' },
  { word: 'tomat', letter: 'T', art: 'tomat' },
  { word: 'telur', letter: 'T', art: 'telur' },
  { word: 'katak', letter: 'K', art: 'katak' },
  { word: 'kado', letter: 'K', art: 'kado' },
  { word: 'nasi', letter: 'N', art: 'nasi' },
  { word: 'layang-layang', letter: 'L', art: 'layang-layang' },
  { word: 'donat', letter: 'D', art: 'donat' },
  { word: 'domba', letter: 'D', art: 'domba' },
  { word: 'gitar', letter: 'G', art: 'gitar' },
  { word: 'roket', letter: 'R', art: 'roket' },
  { word: 'roda', letter: 'R', art: 'roda' },
  { word: 'hujan', letter: 'H', art: 'hujan' },
  { word: 'jagung', letter: 'J', art: 'jagung' },
  { word: 'jendela', letter: 'J', art: 'jendela' },
  { word: 'ceri', letter: 'C', art: 'ceri' },
  { word: 'wafer', letter: 'W', art: 'wafer' },
  { word: 'yogurt', letter: 'Y', art: 'yogurt' },
];

/** Voice line id for a word ("es krim" → "kata_es_krim"). */
export const wordLine = (w: Word): string => `kata_${w.word.replace(/[^a-z]+/g, '_')}`;

/** Letters that have a picture word (Q has none: no common child word starts with Q). */
export const WORD_LETTERS = WORDS.map((w) => w.letter);

export const wordFor = (l: Letter): Word | undefined => WORDS.find((w) => w.letter === l);
/** Picture words whose letter is in play for this age/level. */
export function wordPool(age: '2-3' | '4-5', level = 0, all = false): Word[] {
  const letters = letterPool(age, level, all);
  return WORDS.filter((w) => letters.includes(w.letter));
}

export const VOWEL_WORDS = WORDS.filter((w) => LETTER_ORDER.indexOf(w.letter) < 5);
