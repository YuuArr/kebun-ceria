import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { DIGIT_STROKES, checkpoints } from '../../src/content/strokes';
import { createTracer } from '../../src/games/tulis/logic';
import { makeDigitRound } from '../../src/games/tulisangka/logic';
import { makePatternRound } from '../../src/games/pola/logic';
import { makeMatchRound } from '../../src/games/jumlah/logic';

describe('Menulis Angka', () => {
  it('every digit 0–9 can be traced to completion', () => {
    for (const d of '0123456789') {
      const t = createTracer(DIGIT_STROKES[d]);
      let done = false;
      for (const st of DIGIT_STROKES[d]) for (const p of checkpoints(st, 3)) done = t.touch(p[0], p[1]).letterDone;
      expect(done, d).toBe(true);
      for (const st of DIGIT_STROKES[d]) for (const [x, y] of st) { expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(100); expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThanOrEqual(140); }
    }
  });
  it('3 different digits; small numbers for the youngest', () => {
    for (let seed = 0; seed < 100; seed++) {
      const r = makeDigitRound('2-3', createRng(seed), 0);
      expect(new Set(r).size).toBe(3);
      for (const d of r) expect(Number(d)).toBeLessThanOrEqual(3);
      for (const d of makeDigitRound('4-5', createRng(seed), 3)) expect('0123456789').toContain(d);
    }
  });
});

describe('Pola Berulang', () => {
  it('5 questions; the answer continues the pattern and is offered once', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const [age, lvl] of [['2-3', 0], ['4-5', 0], ['4-5', 3]] as const) {
        const r = makePatternRound(age, createRng(seed), lvl);
        expect(r).toHaveLength(5);
        for (const q of r) {
          const full = [...q.shown, q.answer];
          const unit = q.unit.length;
          for (let i = unit; i < full.length; i++) expect(full[i]).toBe(full[i - unit]);
          expect(q.options.filter((x) => x === q.answer)).toHaveLength(1);
          expect(new Set(q.options).size).toBe(q.options.length);
          if (age === '2-3') expect(q.unit).toHaveLength(2);
        }
      }
    }
  });
});

describe('Angka & Jumlah', () => {
  it('3 steps of distinct amounts within the age range', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const [age, k, max] of [['2-3', 2, 3], ['4-5', 3, 5]] as const) {
        const r = makeMatchRound(age, createRng(seed), 0);
        expect(r).toHaveLength(3);
        for (const st of r) {
          expect(st).toHaveLength(k);
          expect(new Set(st).size).toBe(k);
          for (const n of st) { expect(n).toBeGreaterThanOrEqual(1); expect(n).toBeLessThanOrEqual(max); }
        }
      }
    }
    for (const st of makeMatchRound('4-5', createRng(1), 3)) for (const n of st) expect(n).toBeLessThanOrEqual(10);
  });
});
