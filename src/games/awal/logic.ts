import type { Letter } from '../../content/letters';
import { wordPool, type Word } from '../../content/words';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface InitialStep {
  letters: Letter[];
  pictures: Word[];
}

/** Three steps: drag each picture to the box with its first letter. Pool widens with level. */
export function makeInitialRound(age: AgeGroup, rng: Rng, level = 0): InitialStep[] {
  const pool = wordPool(age, level);
  const k = age === '2-3' ? 2 : level >= 3 ? 4 : 3;
  return Array.from({ length: 3 }, () => {
    const words = rng.shuffle(pool).slice(0, k);
    return { letters: words.map((w) => w.letter), pictures: rng.shuffle(words) };
  });
}
