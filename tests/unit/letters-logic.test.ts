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

describe('Gelembung Huruf syllable stage', () => {
  it('top level for 4-5 mixes 3 syllable steps and 2 letter steps', () => {
    for (let seed = 0; seed < 200; seed++) {
      const r = makeLetterRound('4-5', createRng(seed), 3);
      expect(r.filter((s) => s.kind === 'suku')).toHaveLength(3);
      for (const s of r.filter((x) => x.kind === 'suku')) {
        expect(s.target).toMatch(/^[MBPSTKNLD][AIUEO]$/);
        expect(s.bubbles).toHaveLength(4);
        // distractors share the consonant: BA BI BU BE
        for (const b of s.bubbles) expect(b[0]).toBe(s.target[0]);
        expect(s.bubbles.filter((b) => b === s.target)).toHaveLength(1);
      }
    }
  });
  it('lower levels and age 2-3 never show syllables', () => {
    for (let seed = 0; seed < 100; seed++) {
      for (const [age, lvl] of [['4-5', 2], ['2-3', 3]] as const) {
        expect(makeLetterRound(age, createRng(seed), lvl).every((s) => s.kind === 'huruf')).toBe(true);
      }
    }
  });
});

describe('Gelembung Huruf variety', () => {
  it('five different letters per round', () => {
    for (let seed = 0; seed < 300; seed++) {
      const r = makeLetterRound('4-5', createRng(seed), 0);
      expect(new Set(r.map((s) => s.target)).size).toBe(5);
    }
  });
  it('"semua" shows letters beyond the level pool from the start', () => {
    const targets = new Set<string>();
    for (let seed = 0; seed < 200; seed++) for (const s of makeLetterRound('2-3', createRng(seed), 0, { all: true })) targets.add(s.target);
    expect(targets.size).toBe(26);
  });
  it('rarely seen letters come first', () => {
    const seen = { A: 9, I: 9, U: 9, E: 9, O: 9 };
    const r = makeLetterRound('4-5', createRng(3), 1, { seen }); // 14 letters: 9 unseen
    for (const s of r) expect('AIUEO').not.toContain(s.target);
  });
});
