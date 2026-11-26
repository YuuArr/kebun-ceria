import { describe, expect, it } from 'vitest';
import { makePathRound } from '../../src/games/sungai/logic';
import { BUILDS, createBuild } from '../../src/games/rakit/logic';
import { STORIES } from '../../src/content/stories';
import { createRng } from '../../src/core/rng';

describe('Sungai Angka', () => {
  it('3 crossings; missing is in the path, offered once, numbers ≤ 10', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const age of ['2-3', '4-5'] as const) {
        const r = makePathRound(age, createRng(seed));
        expect(r).toHaveLength(3);
        for (const c of r) {
          expect(c.stones).toContain(c.missing);
          expect(c.choices.filter((x) => x === c.missing)).toHaveLength(1);
          expect(new Set(c.choices).size).toBe(c.choices.length);
          for (const n of [...c.stones, ...c.choices]) expect(n).toBeGreaterThanOrEqual(1), expect(n).toBeLessThanOrEqual(10);
          for (let i = 1; i < c.stones.length; i++) expect(c.stones[i]).toBe(c.stones[i - 1] + 1);
          if (age === '2-3') { expect(c.stones).toEqual([1, 2, 3]); expect(c.choices).toEqual([c.missing]); }
          else { expect(c.stones).toHaveLength(5); expect(c.choices).toHaveLength(3); }
        }
      }
    }
  });
});

describe('Rakit', () => {
  it('builds accept only matching shapes and finish when every slot is filled', () => {
    for (const b of BUILDS) {
      const st = createBuild(b);
      const first = b.slots[0];
      const wrong = b.slots.find((s) => s.shape !== first.shape)!;
      expect(st.place(first.id, wrong.shape).ok).toBe(false);
      b.slots.forEach((s, i) => {
        const r = st.place(s.id, s.shape);
        expect(r.ok).toBe(true);
        expect(r.done).toBe(i === b.slots.length - 1);
      });
      expect(st.place(first.id, first.shape).ok).toBe(false); // already filled
    }
  });
});

describe('Cerita', () => {
  it('every page has 3–5 words', () => {
    for (const s of STORIES) for (const p of s.pages) {
      const n = p.text.split(/\s+/).length;
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(5);
    }
  });
});
