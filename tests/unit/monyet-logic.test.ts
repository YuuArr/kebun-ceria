import { describe, expect, it } from 'vitest';
import { createFeeder, makeFeedRound } from '../../src/games/monyet/logic';
import { createRng } from '../../src/core/rng';

describe('Kasih Makan Monyet logic', () => {
  it('3 feedings; 1–3 for 2-3, 2–6 for 4-5; consecutive differ', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const [age, lo, hi] of [['2-3', 1, 3], ['4-5', 2, 6]] as const) {
        const r = makeFeedRound(age, createRng(seed));
        expect(r).toHaveLength(3);
        r.forEach((n, i) => {
          expect(n).toBeGreaterThanOrEqual(lo);
          expect(n).toBeLessThanOrEqual(hi);
          if (i) expect(n).not.toBe(r[i - 1]);
        });
      }
    }
  });
  it('refuses food once full', () => {
    const f = createFeeder(2);
    expect(f.feed()).toEqual({ eaten: 1, accepted: true, full: false });
    expect(f.feed()).toEqual({ eaten: 2, accepted: true, full: true });
    expect(f.feed()).toEqual({ eaten: 2, accepted: false, full: true });
  });
});
