import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { makeRoutineRound } from '../../src/games/kebiasaan/logic';
import { HEALTHY, TREATS, makePlateRound } from '../../src/games/sehat/logic';
import { ROUTINE_ART_IDS } from '../../src/art/routines';
import { ROUTINES } from '../../src/content/routines';

describe('Urutkan Kebiasaan', () => {
  it('every step has a picture; 2 different routines; fewer steps for the youngest', () => {
    for (const r of ROUTINES) for (const st of r.steps) expect(ROUTINE_ART_IDS).toContain(st.art);
    for (let seed = 0; seed < 50; seed++) {
      const r = makeRoutineRound('2-3', createRng(seed), 0);
      expect(r).toHaveLength(2);
      expect(r[0].routine.id).not.toBe(r[1].routine.id);
      for (const q of r) expect(q.steps.length).toBe(3);
      for (const q of makeRoutineRound('4-5', createRng(seed), 3)) expect(q.steps.length).toBe(q.routine.steps.length);
    }
  });
  it('kept steps stay in their real order', () => {
    for (let seed = 0; seed < 50; seed++) for (const q of makeRoutineRound('2-3', createRng(seed), 0)) {
      const idx = q.steps.map((s) => q.routine.steps.indexOf(s));
      expect([...idx].sort((a, b) => a - b)).toEqual(idx);
    }
  });
});

describe('Makanan Sehat', () => {
  it('3 plates; each offers healthy food to place and treats that stay out', () => {
    for (let seed = 0; seed < 100; seed++) {
      const r = makePlateRound('4-5', createRng(seed), 0);
      expect(r).toHaveLength(3);
      for (const p of r) {
        expect(p.items.filter((i) => HEALTHY.includes(i)).length).toBe(p.need);
        expect(p.items.some((i) => TREATS.includes(i))).toBe(true);
      }
    }
  });
});
