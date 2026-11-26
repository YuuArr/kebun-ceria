import type { ArtId } from '../art/things';
import { LETTER_ORDER, type Letter } from './letters';

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
];

export const wordFor = (l: Letter): Word => WORDS.find((w) => w.letter === l)!;
export const VOWEL_WORDS = WORDS.filter((w) => LETTER_ORDER.indexOf(w.letter) < 5);
