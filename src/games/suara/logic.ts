import { SOUNDING, type Animal } from '../../content/animals';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface SoundQ {
  animal: Animal;
  options: Animal[];
}

/** Five "who makes this sound?" questions. */
export function makeSoundRound(age: AgeGroup, rng: Rng, level = 0): SoundQ[] {
  const n = age === '2-3' ? 2 : level >= 2 ? 4 : 3;
  return rng.shuffle(SOUNDING).slice(0, 5).map((animal) => ({
    animal,
    options: rng.shuffle([animal, ...rng.shuffle(SOUNDING.filter((a) => a.id !== animal.id)).slice(0, n - 1)]),
  }));
}
