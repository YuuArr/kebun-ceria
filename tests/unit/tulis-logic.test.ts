import { describe, expect, it } from 'vitest';
import { STROKES, checkpoints } from '../../src/content/strokes';
import { LETTER_ORDER } from '../../src/content/letters';
import { createTracer, makeTraceRound } from '../../src/games/tulis/logic';
import { createRng } from '../../src/core/rng';

describe('Menulis Huruf', () => {
  it('has strokes for all 26 letters inside the box', () => {
    for (const l of LETTER_ORDER) {
      expect(STROKES[l].length).toBeGreaterThan(0);
      for (const st of STROKES[l]) for (const [x, y] of st) {
        expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(100);
        expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThanOrEqual(140);
      }
    }
  });
  it('tracing every stroke along its path completes the letter, in order', () => {
    for (const l of LETTER_ORDER) {
      const t = createTracer(STROKES[l]);
      let last = { strokeDone: false, letterDone: false, stroke: 0 };
      STROKES[l].forEach((st, i) => {
        expect(t.activeStroke()).toBe(i);
        for (const p of checkpoints(st, 3)) last = t.touch(p[0], p[1]);
      });
      expect(last.letterDone).toBe(true);
    }
  });
  it('scribbling far from the path completes nothing', () => {
    const t = createTracer(STROKES.A);
    for (let i = 0; i < 200; i++) expect(t.touch(95, 135 - i * 0.1).strokeDone).toBe(false);
    expect(t.activeStroke()).toBe(0);
  });
  it('only the active stroke counts', () => {
    const t = createTracer(STROKES.T);
    for (const p of checkpoints(STROKES.T[1], 3)) t.touch(p[0], p[1]); // second stroke first
    expect(t.activeStroke()).toBe(0);
  });
  it('rounds: 3 different letters from the pool', () => {
    for (let seed = 0; seed < 100; seed++) {
      const r = makeTraceRound('4-5', createRng(seed), 0);
      expect(r).toHaveLength(3);
      expect(new Set(r).size).toBe(3);
    }
  });
});
