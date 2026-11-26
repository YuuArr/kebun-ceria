import { CLOSED, CVCV, THREE, type SyllableWord } from '../../content/syllables';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';

export interface BuildQ {
  word: SyllableWord;
  /** Shuffled syllable tiles (may include one extra distractor). */
  tiles: string[];
}

const POOLS: Record<AgeGroup, (readonly SyllableWord[])[]> = {
  '2-3': [CVCV, CVCV, CVCV, CVCV],
  '4-5': [CVCV, [...CVCV, ...CLOSED], [...CVCV, ...CLOSED], [...CLOSED, ...THREE, ...THREE]],
};

/** Three words to build from syllable tiles. */
export function makeBuildRound(age: AgeGroup, rng: Rng, level = 0, seen: Record<string, number> = {}): BuildQ[] {
  const L = Math.min(3, level);
  const pool = POOLS[age][L];
  const words = pickFresh(pool.map((w) => w.word), 3, rng, seen).map((x) => pool.find((w) => w.word === x)!);
  return words.map((word) => {
    const extra = age === '4-5' && L >= 2
      ? rng.pick([...CVCV, ...CLOSED].flatMap((w) => w.parts).filter((p) => !word.parts.includes(p)))
      : null;
    return { word, tiles: rng.shuffle(extra ? [...word.parts, extra] : [...word.parts]) };
  });
}
