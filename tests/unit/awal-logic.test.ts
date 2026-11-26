import { describe, expect, it } from 'vitest';
import { makeInitialRound } from '../../src/games/awal/logic';
import { createRng } from '../../src/core/rng';

describe('Cocokkan Huruf Awal logic', () => {
  it('3 steps; 2 vowel boxes for 2-3, 3 boxes for 4-5; one picture per box', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const [age, k] of [['2-3', 2], ['4-5', 3]] as const) {
        const r = makeInitialRound(age, createRng(seed));
        expect(r).toHaveLength(3);
        for (const st of r) {
          expect(st.letters).toHaveLength(k);
          expect(new Set(st.letters).size).toBe(k);
          expect(st.pictures.map((p) => p.letter).sort()).toEqual([...st.letters].sort());
          if (age === '2-3') for (const l of st.letters) expect('AIUEO').toContain(l);
        }
      }
    }
  });
});
