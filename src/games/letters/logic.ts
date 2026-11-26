import { letterPool } from '../../content/letters';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';

export interface LetterStep {
  /** 'huruf' = a single letter; 'suku' = a consonant+vowel syllable like "BA". */
  kind: 'huruf' | 'suku';
  target: string;
  bubbles: string[];
}

export const STEPS_PER_ROUND = 5;
export const SYLLABLE_CONSONANTS = ['M', 'B', 'P', 'S', 'T', 'K', 'N', 'L', 'D'] as const;
export const VOWELS = ['A', 'I', 'U', 'E', 'O'] as const;
export const SYLLABLES = SYLLABLE_CONSONANTS.flatMap((c) => VOWELS.map((v) => c + v));
const BUBBLES: Record<AgeGroup, number> = { '2-3': 3, '4-5': 4 };

/**
 * Five "find it" steps. Letters come from the pool for this age/level.
 * At the top level for 4–5, three steps are syllables (BA/BI/BU…): same consonant, different vowel.
 */
export interface PoolOptions {
  /** Show A–Z regardless of level (parent setting). */
  all?: boolean;
  /** How often each letter was shown before; rarely seen letters come first. */
  seen?: Record<string, number>;
}

export function makeLetterRound(age: AgeGroup, rng: Rng, level = 0, opts: PoolOptions = {}): LetterStep[] {
  const pool = letterPool(age, level, opts.all);
  // Five different letters per round, least-seen first, in random order.
  const fresh = rng.shuffle(pickFresh(pool, STEPS_PER_ROUND, rng, opts.seen));
  let next = 0;
  const syllableSteps = age === '4-5' && level >= 3 ? new Set(rng.shuffle([0, 1, 2, 3, 4]).slice(0, 3)) : new Set<number>();
  const steps: LetterStep[] = [];
  for (let i = 0; i < STEPS_PER_ROUND; i++) {
    const prev = steps[i - 1]?.target;
    if (syllableSteps.has(i)) {
      const target = rng.pick(SYLLABLES.filter((s) => s !== prev));
      const others = rng.shuffle(VOWELS.filter((v) => v !== target[1])).slice(0, 3).map((v) => target[0] + v);
      steps.push({ kind: 'suku', target, bubbles: rng.shuffle([target, ...others]) });
    } else {
      const target = fresh[next++ % fresh.length];
      const others = rng.shuffle(pool.filter((l) => l !== target)).slice(0, BUBBLES[age] - 1);
      steps.push({ kind: 'huruf', target, bubbles: rng.shuffle([target, ...others]) });
    }
  }
  return steps;
}
