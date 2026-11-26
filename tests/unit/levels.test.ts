import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { letterPool } from '../../src/content/letters';
import { wordPool } from '../../src/content/words';
import { makeCountRound } from '../../src/games/count/logic';
import { makeFeedRound } from '../../src/games/monyet/logic';
import { makeCompareRound } from '../../src/games/banding/logic';
import { makePathRound } from '../../src/games/sungai/logic';
import { makePostRound } from '../../src/games/kotakpos/logic';
import { makeSortRound } from '../../src/games/sortir/logic';
import { makeLetterRound } from '../../src/games/letters/logic';

const many = <T>(f: (seed: number) => T[]) => Array.from({ length: 200 }, (_, s) => f(s)).flat();

describe('levels make games gradually harder, within the age limits', () => {
  it('letters open from 9 to 26 for 4-5; 2-3 stays near vowels', () => {
    expect([0, 1, 2, 3].map((l) => letterPool('4-5', l).length)).toEqual([9, 14, 26, 26]);
    expect(letterPool('2-3', 0)).toEqual(['A', 'I', 'U', 'E', 'O']);
    expect(letterPool('2-3', 3)).toHaveLength(7);
    expect(new Set(wordPool('4-5', 3).map((w) => w.letter)).size).toBe(25); // Q has no picture word
    const used = new Set(many((s) => makeLetterRound('4-5', createRng(s), 2)).map((st) => st.target));
    expect(used.size).toBeGreaterThan(20);
  });
  it('counting goes up to 10 only at the top level; never above 10', () => {
    const top = many((s) => makeCountRound('4-5', createRng(s), 3)).map((q) => q.n);
    expect(Math.max(...top)).toBe(10);
    expect(Math.min(...top)).toBeGreaterThanOrEqual(5);
    const small = many((s) => makeCountRound('2-3', createRng(s), 3)).map((q) => q.n);
    expect(Math.max(...small)).toBeLessThanOrEqual(5);
  });
  it('monkey and river stay within 1–10', () => {
    for (const age of ['2-3', '4-5'] as const) for (let l = 0; l < 4; l++) {
      for (const n of many((s) => makeFeedRound(age, createRng(s), l))) expect(n).toBeLessThanOrEqual(8);
      for (const c of many((s) => makePathRound(age, createRng(s), l))) {
        for (const n of [...c.stones, ...c.choices]) expect(n).toBeGreaterThanOrEqual(1), expect(n).toBeLessThanOrEqual(10);
        expect(c.choices.filter((x) => x === c.missing)).toHaveLength(1);
      }
    }
  });
  it('comparison contrast never drops below 1 and counts stay ≤ 10', () => {
    for (const q of many((s) => makeCompareRound('4-5', createRng(s), 3))) {
      if (q.kind === 'banyak' || q.kind === 'sedikit') {
        expect(q.left).not.toBe(q.right);
        expect(Math.max(q.left, q.right)).toBeLessThanOrEqual(10);
      }
    }
  });
  it('shape post and colour sort get more targets at level 2+', () => {
    expect(makePostRound('4-5', createRng(1), 2).holes).toHaveLength(4);
    expect(makeSortRound('4-5', createRng(1), 2).colors).toHaveLength(4);
    expect(makeSortRound('2-3', createRng(1), 2).items).toHaveLength(6);
  });
});
