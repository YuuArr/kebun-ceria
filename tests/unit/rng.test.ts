import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';

describe('rng', () => {
  it('is deterministic for a seed', () => {
    const a = createRng(1), b = createRng(1);
    expect([a.next(), a.next()]).toEqual([b.next(), b.next()]);
  });
  it('int stays in bounds', () => {
    const r = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const n = r.int(3, 8);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(8);
    }
  });
  it('shuffle keeps elements', () => {
    const r = createRng(3);
    expect(r.shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
});
