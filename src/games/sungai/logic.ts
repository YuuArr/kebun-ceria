import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface Crossing {
  stones: number[];
  missing: number;
  choices: number[];
}

/** Three river crossings: one stepping stone is missing; the child puts the right number back. */
export function makePathRound(age: AgeGroup, rng: Rng, level = 0): Crossing[] {
  const L = Math.min(3, level);
  return Array.from({ length: 3 }, () => {
    if (age === '2-3') {
      const len = L >= 2 ? 4 : 3;
      const stones = Array.from({ length: len }, (_, i) => i + 1);
      const missing = rng.int(1, len);
      const choices = L >= 2 ? rng.shuffle([missing, rng.pick(stones.filter((n) => n !== missing))]) : [missing];
      return { stones, missing, choices };
    }
    const len = L >= 3 ? 6 : 5;
    const start = rng.int(1, [3, 6, 6, 5][L]);
    const stones = Array.from({ length: len }, (_, i) => start + i);
    const missing = stones[rng.int(1, len - 2)];
    const near = [missing - 2, missing - 1, missing + 1, missing + 2, missing + 3].filter((n) => n >= 1 && n <= 10);
    return { stones, missing, choices: rng.shuffle([missing, ...rng.shuffle(near).slice(0, L >= 2 ? 3 : 2)]) };
  });
}
