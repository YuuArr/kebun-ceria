import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

const RANGE: Record<AgeGroup, [number, number]> = { '2-3': [1, 3], '4-5': [2, 6] };

/** Three feedings; how many bananas the monkey wants each time. */
export function makeFeedRound(age: AgeGroup, rng: Rng): number[] {
  const [min, max] = RANGE[age];
  const out: number[] = [];
  for (let i = 0; i < 3; i++) {
    let n = rng.int(min, max);
    while (n === out[i - 1]) n = rng.int(min, max);
    out.push(n);
  }
  return out;
}

/** The monkey eats exactly `n` bananas, then politely refuses more. */
export function createFeeder(n: number) {
  let eaten = 0;
  return {
    feed(): { eaten: number; accepted: boolean; full: boolean } {
      if (eaten >= n) return { eaten, accepted: false, full: true };
      eaten++;
      return { eaten, accepted: true, full: eaten === n };
    },
  };
}
