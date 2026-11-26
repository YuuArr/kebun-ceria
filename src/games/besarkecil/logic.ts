import { letterPool, type Letter } from '../../content/letters';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';
import type { PoolOptions } from '../letters/logic';

/** Three steps of letter pairs (uppercase box ↔ lowercase tile). No letter repeats within a round when the pool allows. */
export function makeCaseRound(age: AgeGroup, rng: Rng, level = 0, opts: PoolOptions = {}): Letter[][] {
  const k = age === '2-3' ? 2 : level >= 3 ? 4 : 3;
  const pool = letterPool(age, level, opts.all);
  const fresh = pickFresh(pool, Math.min(pool.length, k * 3), rng, opts.seen);
  return Array.from({ length: 3 }, (_, i) => {
    const step = fresh.slice(i * k, i * k + k);
    return step.length === k ? step : rng.shuffle(pool).slice(0, k);
  });
}
