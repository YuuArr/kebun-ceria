import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { makeShadowRound } from '../../src/games/bayangan/logic';
import { mix, makeMixRound } from '../../src/games/campur/logic';
import { makePuzzle, pieceCells } from '../../src/games/puzzle/logic';

describe('Cari Bayangan', () => {
  it('5 different objects; answer offered once; no look-alike shadows together', async () => {
    for (let seed = 0; seed < 200; seed++) {
      const r = makeShadowRound('4-5', createRng(seed), 0);
      expect(r).toHaveLength(5);
      expect(new Set(r.map((q) => q.art)).size).toBe(5);
      for (const q of r) {
        expect(q.options.filter((o) => o === q.art)).toHaveLength(1);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.options).toHaveLength(3);
        const groups = (await import('../../src/games/bayangan/logic')).LOOKALIKES;
        for (const g of groups) expect(q.options.filter((o) => g.includes(o)).length).toBeLessThanOrEqual(1);
      }
      for (const q of makeShadowRound('2-3', createRng(seed), 0)) expect(q.options).toHaveLength(2);
      for (const q of makeShadowRound('4-5', createRng(seed), 2)) expect(q.options).toHaveLength(4);
    }
  });
});

describe('Campur Warna', () => {
  it('mixes primaries into secondaries, either order', () => {
    expect(mix('merah', 'kuning')).toBe('oranye');
    expect(mix('kuning', 'merah')).toBe('oranye');
    expect(mix('kuning', 'biru')).toBe('hijau');
    expect(mix('merah', 'biru')).toBe('ungu');
    expect(mix('biru', 'biru')).toBe('biru');
  });
  it('4-5 asks for 3 different targets; 2-3 explores freely', () => {
    for (let seed = 0; seed < 50; seed++) {
      const r = makeMixRound('4-5', createRng(seed));
      expect(r.mode).toBe('target');
      expect(new Set(r.targets)).toEqual(new Set(['oranye', 'hijau', 'ungu']));
      expect(makeMixRound('2-3', createRng(seed)).mode).toBe('bebas');
    }
  });
});

describe('Puzzle Gambar', () => {
  it('grid grows with age and level; every cell has one piece', () => {
    expect(makePuzzle('2-3', createRng(1), 0)).toMatchObject({ rows: 2, cols: 2 });
    expect(makePuzzle('4-5', createRng(1), 0)).toMatchObject({ rows: 2, cols: 3 });
    expect(makePuzzle('4-5', createRng(1), 2)).toMatchObject({ rows: 3, cols: 3 });
    const p = makePuzzle('4-5', createRng(1), 2);
    expect(pieceCells(p)).toHaveLength(9);
  });
});
