import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { makeFamilyRound } from '../../src/games/induk/logic';
import { makeFoodRound } from '../../src/games/makanan/logic';
import { makeSoundRound } from '../../src/games/suara/logic';
import { line } from '../../src/content/lines';
import { ANIMALS } from '../../src/content/animals';

describe('Kandang Hewan', () => {
  it('voice lines exist for every animal name, sound and food', () => {
    for (const a of ANIMALS) {
      expect(() => line(`hewan_${a.id}`)).not.toThrow();
      if (a.sound) expect(() => line(`suara_${a.id}`)).not.toThrow();
      if (a.food) expect(() => line(`makan_${a.id}`)).not.toThrow();
    }
  });
  it('Induk & Anak: 3 steps of distinct animals', () => {
    for (let seed = 0; seed < 100; seed++) {
      const r = makeFamilyRound('4-5', createRng(seed), 0);
      expect(r).toHaveLength(3);
      for (const st of r) { expect(st).toHaveLength(3); expect(new Set(st.map((a) => a.id)).size).toBe(3); }
      expect(makeFamilyRound('2-3', createRng(seed), 0)[0]).toHaveLength(2);
    }
  });
  it('Hewan & Makanan: every animal shown has its food in the tray', () => {
    for (let seed = 0; seed < 100; seed++) for (const st of makeFoodRound('4-5', createRng(seed), 0)) {
      expect(st.map((a) => a.food).every(Boolean)).toBe(true);
    }
  });
  it('Suara Hewan: 5 sounds; the right animal offered once', () => {
    for (let seed = 0; seed < 100; seed++) {
      const r = makeSoundRound('4-5', createRng(seed), 0);
      expect(r).toHaveLength(5);
      for (const q of r) expect(q.options.filter((o) => o.id === q.animal.id)).toHaveLength(1);
    }
  });
});
