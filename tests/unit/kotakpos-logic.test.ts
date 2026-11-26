import { describe, expect, it } from 'vitest';
import { makePostRound, SHAPE_ITEMS } from '../../src/games/kotakpos/logic';
import { createRng } from '../../src/core/rng';

describe('Kotak Pos Bentuk logic', () => {
  it('2-3: 3 basic holes, one item each', () => {
    for (let seed = 0; seed < 200; seed++) {
      const r = makePostRound('2-3', createRng(seed));
      expect([...r.holes].sort()).toEqual(['lingkaran', 'persegi', 'segitiga']);
      expect(r.items).toHaveLength(3);
    }
  });
  it('4-5: 3 distinct holes from 6 shapes, 2 items per hole, items match holes', () => {
    for (let seed = 0; seed < 200; seed++) {
      const r = makePostRound('4-5', createRng(seed));
      expect(new Set(r.holes).size).toBe(3);
      expect(r.items).toHaveLength(6);
      for (const it of r.items) {
        expect(r.holes).toContain(it.shape);
        expect(SHAPE_ITEMS[it.shape]).toContain(it.art);
      }
    }
  });
});
