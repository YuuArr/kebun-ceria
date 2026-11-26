import { LETTER_ORDER, type Letter } from '../../content/letters';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface LetterStep {
  target: Letter;
  bubbles: Letter[];
}

export const STEPS_PER_ROUND = 5;
const POOL: Record<AgeGroup, readonly Letter[]> = { '2-3': LETTER_ORDER.slice(0, 5), '4-5': LETTER_ORDER };
const BUBBLES: Record<AgeGroup, number> = { '2-3': 3, '4-5': 4 };

/** Five "find the letter" steps. Bubbles come from the same age pool, target exactly once. */
export function makeLetterRound(age: AgeGroup, rng: Rng): LetterStep[] {
  const pool = POOL[age];
  const steps: LetterStep[] = [];
  for (let i = 0; i < STEPS_PER_ROUND; i++) {
    const target = rng.pick(pool.filter((l) => l !== steps[i - 1]?.target));
    const others = rng.shuffle(pool.filter((l) => l !== target)).slice(0, BUBBLES[age] - 1);
    steps.push({ target, bubbles: rng.shuffle([target, ...others]) });
  }
  return steps;
}
