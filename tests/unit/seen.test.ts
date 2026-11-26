import { beforeEach, describe, expect, it } from 'vitest';
import { getSeen, markSeen, pickFresh, _resetSeenMemory } from '../../src/core/seen';
import { createRng } from '../../src/core/rng';

beforeEach(() => { localStorage.clear(); _resetSeenMemory(); });

describe('fresh picking', () => {
  it('picks k distinct items, least-seen first', () => {
    const seen = { A: 5, B: 0, C: 2, D: 0 };
    const got = pickFresh(['A', 'B', 'C', 'D'], 3, createRng(1), seen);
    expect(new Set(got).size).toBe(3);
    expect(got).not.toContain('A');
  });
  it('over many rounds every letter gets its turn', () => {
    const pool = 'ABCDEFGHIJ'.split('');
    for (let r = 0; r < 4; r++) markSeen('t', pickFresh(pool, 5, createRng(r), getSeen('t')));
    const counts = Object.values(getSeen('t'));
    expect(counts).toHaveLength(10);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });
});
