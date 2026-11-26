import { describe, expect, it } from 'vitest';
import { createCounter, makeCountRound } from '../../src/games/count/logic';
import { createRng } from '../../src/core/rng';

describe('Sentuh & Hitung logic', () => {
  it('uses 1–3 for age 2-3 and 3–8 for age 4-5, 3 questions per round', () => {
    for (let seed = 0; seed < 200; seed++) {
      const small = makeCountRound('2-3', createRng(seed));
      const big = makeCountRound('4-5', createRng(seed));
      expect(small).toHaveLength(3);
      expect(big).toHaveLength(3);
      for (const q of small) expect(q.n).toBeGreaterThanOrEqual(1), expect(q.n).toBeLessThanOrEqual(3);
      for (const q of big) expect(q.n).toBeGreaterThanOrEqual(3), expect(q.n).toBeLessThanOrEqual(8);
    }
  });

  it('never repeats an object in consecutive questions', () => {
    for (let seed = 0; seed < 200; seed++) {
      const r = makeCountRound('4-5', createRng(seed));
      expect(r[0].object).not.toBe(r[1].object);
      expect(r[1].object).not.toBe(r[2].object);
    }
  });

  it('counts each object once even when tapped twice', () => {
    const c = createCounter(3);
    expect(c.tap(1)).toEqual({ counted: 1, isNew: true, done: false });
    expect(c.tap(1)).toEqual({ counted: 1, isNew: false, done: false });
    expect(c.tap(0).counted).toBe(2);
    expect(c.tap(2)).toEqual({ counted: 3, isNew: true, done: true });
  });
});

describe('Sentuh & Hitung content', () => {
  it('uses at least 15 different objects over many rounds', async () => {
    const { COUNTABLES } = await import('../../src/content/lines');
    expect(Object.keys(COUNTABLES).length).toBeGreaterThanOrEqual(15);
    const seen = new Set<string>();
    for (let seed = 0; seed < 300; seed++) for (const q of makeCountRound('4-5', createRng(seed))) seen.add(q.object);
    expect(seen.size).toBe(Object.keys(COUNTABLES).length);
  });
});
