import { COUNT_OBJECTS, type CountObject } from '../../content/lines';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface CountQuestion {
  object: CountObject;
  n: number;
}

export const QUESTIONS_PER_ROUND = 3;
const RANGE: Record<AgeGroup, [number, number]> = { '2-3': [1, 3], '4-5': [3, 8] };

/** Three questions; the object changes every question, the amount stays in the age range. */
export function makeCountRound(age: AgeGroup, rng: Rng): CountQuestion[] {
  const [min, max] = RANGE[age];
  const out: CountQuestion[] = [];
  for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
    const choices = COUNT_OBJECTS.filter((o) => o !== out[i - 1]?.object);
    let n = rng.int(min, max);
    if (n === out[i - 1]?.n && max > min) n = n === max ? n - 1 : n + 1;
    out.push({ object: rng.pick(choices), n });
  }
  return out;
}

/** One-to-one correspondence: each object counts once, in tap order. */
export function createCounter(n: number) {
  const tapped = new Set<number>();
  return {
    tap(index: number): { counted: number; isNew: boolean; done: boolean } {
      const isNew = index >= 0 && index < n && !tapped.has(index);
      if (isNew) tapped.add(index);
      return { counted: tapped.size, isNew, done: tapped.size === n };
    },
  };
}
