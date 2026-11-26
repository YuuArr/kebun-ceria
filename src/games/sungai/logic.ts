import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface Crossing {
  stones: number[];
  missing: number;
  choices: number[];
}

/** Three river crossings: one stepping stone is missing; the child puts the right number back. */
export function makePathRound(age: AgeGroup, rng: Rng): Crossing[] {
  return Array.from({ length: 3 }, () => {
    if (age === '2-3') {
      const missing = rng.int(1, 3);
      return { stones: [1, 2, 3], missing, choices: [missing] };
    }
    const start = rng.int(1, 6);
    const stones = Array.from({ length: 5 }, (_, i) => start + i);
    const missing = stones[rng.int(1, 3)];
    const near = [missing - 2, missing - 1, missing + 1, missing + 2, missing + 3].filter((n) => n >= 1 && n <= 10);
    return { stones, missing, choices: rng.shuffle([missing, ...rng.shuffle(near).slice(0, 2)]) };
  });
}
