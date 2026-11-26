import { LETTER_ORDER, type Letter } from '../../content/letters';
import { wordFor, type Word } from '../../content/words';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface InitialStep {
  letters: Letter[];
  pictures: Word[];
}

/** Three steps: drag each picture to the box with its first letter. */
export function makeInitialRound(age: AgeGroup, rng: Rng): InitialStep[] {
  const pool: readonly Letter[] = age === '2-3' ? LETTER_ORDER.slice(0, 5) : LETTER_ORDER;
  const k = age === '2-3' ? 2 : 3;
  return Array.from({ length: 3 }, () => {
    const letters = rng.shuffle(pool).slice(0, k);
    return { letters, pictures: rng.shuffle(letters.map(wordFor)) };
  });
}
