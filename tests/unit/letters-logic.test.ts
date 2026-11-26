import { describe, expect, it } from 'vitest';
import { makeLetterRound } from '../../src/games/letters/logic';
import { createRng } from '../../src/core/rng';

describe('Gelembung Huruf logic', () => {
  it('5 steps; 3 bubbles for 2-3, 4 bubbles for 4-5', () => {
    expect(makeLetterRound('2-3', createRng(1))).toHaveLength(5);
    for (const s of makeLetterRound('2-3', createRng(1))) expect(s.bubbles).toHaveLength(3);
    for (const s of makeLetterRound('4-5', createRng(1))) expect(s.bubbles).toHaveLength(4);
  });
  it('target appears exactly once, no duplicate bubbles (1000 rounds)', () => {
    for (let seed = 0; seed < 1000; seed++) {
      for (const age of ['2-3', '4-5'] as const) {
        for (const s of makeLetterRound(age, createRng(seed))) {
          expect(s.bubbles.filter((b) => b === s.target)).toHaveLength(1);
          expect(new Set(s.bubbles).size).toBe(s.bubbles.length);
        }
      }
    }
  });
  it('age 2-3 only uses vowels A I U E O', () => {
    for (let seed = 0; seed < 200; seed++) {
      for (const s of makeLetterRound('2-3', createRng(seed))) {
        for (const b of s.bubbles) expect('AIUEO').toContain(b);
      }
    }
  });
  it('consecutive targets differ', () => {
    for (let seed = 0; seed < 200; seed++) {
      const r = makeLetterRound('4-5', createRng(seed));
      for (let i = 1; i < r.length; i++) expect(r[i].target).not.toBe(r[i - 1].target);
    }
  });
});
