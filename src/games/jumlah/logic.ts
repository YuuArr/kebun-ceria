import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

const MAX: Record<AgeGroup, number[]> = { '2-3': [3, 3, 4, 5], '4-5': [5, 6, 8, 10] };

/** Three steps; each lists distinct amounts. The child drags each numeral onto the group with that many things. */
export function makeMatchRound(age: AgeGroup, rng: Rng, level = 0): number[][] {
  const max = MAX[age][Math.min(3, level)];
  const k = age === '2-3' ? 2 : 3;
  return Array.from({ length: 3 }, () => rng.shuffle(Array.from({ length: max }, (_, i) => i + 1)).slice(0, k));
}
