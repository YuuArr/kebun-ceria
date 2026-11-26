import { ANIMALS, type Animal } from '../../content/animals';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

/** Three steps; drag each baby to its mother. */
export function makeFamilyRound(age: AgeGroup, rng: Rng, level = 0): Animal[][] {
  const k = age === '2-3' ? 2 : level >= 2 ? 4 : 3;
  return Array.from({ length: 3 }, () => rng.shuffle(ANIMALS).slice(0, k));
}
