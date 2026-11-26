import { describe, expect, it } from 'vitest';
import { makeCardDeck } from '../../src/games/kartu/logic';
import { makeSortRound, COLOR_ITEMS } from '../../src/games/sortir/logic';
import { makeCompareRound } from '../../src/games/banding/logic';
import { createRng } from '../../src/core/rng';

describe('Kartu Kata', () => {
  it('5 distinct cards; vowels only for 2-3', () => {
    for (let seed = 0; seed < 200; seed++) {
      const small = makeCardDeck('2-3', createRng(seed));
      const big = makeCardDeck('4-5', createRng(seed));
      expect(small).toHaveLength(5);
      expect(big).toHaveLength(5);
      expect(new Set(big.map((w) => w.word)).size).toBe(5);
      for (const w of small) expect('AIUEO').toContain(w.letter);
    }
  });
});

describe('Sortir Keranjang Warna', () => {
  it('2 colours × 2 items for 2-3, 3 × 2 for 4-5; items match their colour', () => {
    for (let seed = 0; seed < 200; seed++) {
      for (const [age, k] of [['2-3', 2], ['4-5', 3]] as const) {
        const r = makeSortRound(age, createRng(seed));
        expect(new Set(r.colors).size).toBe(k);
        expect(r.items).toHaveLength(k * 2);
        for (const it of r.items) {
          expect(r.colors).toContain(it.color);
          expect(COLOR_ITEMS[it.color]).toContain(it.art);
        }
      }
    }
  });
});

describe('Banyak-Sedikit', () => {
  it('5 questions; strong contrast; 2-3 only asks banyak/besar', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const age of ['2-3', '4-5'] as const) {
        const r = makeCompareRound(age, createRng(seed));
        expect(r).toHaveLength(5);
        for (const q of r) {
          expect(q.left).not.toBe(q.right);
          if (q.kind === 'banyak' || q.kind === 'sedikit') {
            expect(Math.abs(q.left - q.right)).toBeGreaterThanOrEqual(age === '2-3' ? 3 : 2);
            expect(Math.max(q.left, q.right)).toBeLessThanOrEqual(age === '2-3' ? 5 : 8);
            expect(Math.min(q.left, q.right)).toBeGreaterThanOrEqual(1);
          }
          if (age === '2-3') expect(['banyak', 'besar']).toContain(q.kind);
        }
      }
    }
  });
});
