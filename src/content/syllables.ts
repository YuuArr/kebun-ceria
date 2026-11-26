import type { ArtId } from '../art/things';

export interface SyllableWord {
  word: string;
  parts: string[];
  art: ArtId;
  /** Word voice line id (matches words.ts wordLine). */
  line: string;
}

const w = (word: string, parts: string, art: ArtId): SyllableWord => ({ word, parts: parts.split('-'), art, line: `kata_${word}` });

/** Easiest: consonant-vowel + consonant-vowel. */
export const CVCV: readonly SyllableWord[] = [
  w('bola', 'BO-LA', 'bola'), w('buku', 'BU-KU', 'buku'), w('sapi', 'SA-PI', 'sapi'), w('topi', 'TO-PI', 'topi'),
  w('roti', 'RO-TI', 'roti'), w('susu', 'SU-SU', 'susu'), w('nasi', 'NA-SI', 'nasi'), w('roda', 'RO-DA', 'roda'),
  w('kado', 'KA-DO', 'kado'), w('yoyo', 'YO-YO', 'yoyo'), w('foto', 'FO-TO', 'foto'), w('hati', 'HA-TI', 'hati'), w('ceri', 'CE-RI', 'ceri'),
];
/** Two syllables with a closing consonant. */
export const CLOSED: readonly SyllableWord[] = [
  w('mobil', 'MO-BIL', 'mobil'), w('lampu', 'LAM-PU', 'lampu'), w('kucing', 'KU-CING', 'kucing'), w('donat', 'DO-NAT', 'donat'),
  w('pisang', 'PI-SANG', 'pisang'), w('tomat', 'TO-MAT', 'tomat'), w('telur', 'TE-LUR', 'telur'), w('nanas', 'NA-NAS', 'nanas'),
  w('apel', 'A-PEL', 'apel'), w('ikan', 'I-KAN', 'ikan'), w('ular', 'U-LAR', 'ular'), w('gajah', 'GA-JAH', 'gajah'),
  w('gitar', 'GI-TAR', 'gitar'), w('roket', 'RO-KET', 'roket'), w('jeruk', 'JE-RUK', 'jeruk'), w('cicak', 'CI-CAK', 'cicak'),
  w('ayam', 'A-YAM', 'ayam'), w('katak', 'KA-TAK', 'katak'), w('hujan', 'HU-JAN', 'hujan'), w('jagung', 'JA-GUNG', 'jagung'),
];
/** Three syllables. */
export const THREE: readonly SyllableWord[] = [
  w('stroberi', 'STRO-BE-RI', 'stroberi'), w('jendela', 'JEN-DE-LA', 'jendela'), w('xilofon', 'XI-LO-FON', 'xilofon'),
];

export const ALL_SYLLABLE_WORDS = [...CVCV, ...CLOSED, ...THREE];
