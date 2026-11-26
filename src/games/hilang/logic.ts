import { ART_IDS, type ArtId } from '../../art/things';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface MissingQ {
  shown: ArtId[];
  missing: ArtId;
  options: ArtId[];
}

const SHOWN: Record<AgeGroup, number[]> = { '2-3': [3, 3, 3, 4], '4-5': [3, 4, 5, 5] };

/** Four "what disappeared?" questions. */
export function makeMissingRound(age: AgeGroup, rng: Rng, level = 0): MissingQ[] {
  const n = SHOWN[age][Math.min(3, level)];
  return Array.from({ length: 4 }, () => {
    const shown = rng.shuffle(ART_IDS).slice(0, n);
    const missing = rng.pick(shown);
    const others = rng.shuffle(ART_IDS.filter((a) => !shown.includes(a))).slice(0, age === '2-3' ? 1 : 2);
    return { shown, missing, options: rng.shuffle([missing, ...others]) };
  });
}
