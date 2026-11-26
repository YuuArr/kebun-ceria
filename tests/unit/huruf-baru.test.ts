import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { makeCaseRound } from '../../src/games/besarkecil/logic';
import { makeBuildRound } from '../../src/games/susun/logic';
import { ALL_SYLLABLE_WORDS } from '../../src/content/syllables';
import { line } from '../../src/content/lines';

describe('Huruf Besar-Kecil', () => {
  it('3 steps of distinct letters; pair count by age/level', () => {
    for (let seed = 0; seed < 100; seed++) {
      const r = makeCaseRound('4-5', createRng(seed), 0);
      expect(r).toHaveLength(3);
      for (const st of r) { expect(st).toHaveLength(3); expect(new Set(st).size).toBe(3); }
      expect(makeCaseRound('2-3', createRng(seed), 0)[0]).toHaveLength(2);
    }
  });
});

describe('Susun Suku Kata', () => {
  it('parts spell the word; voice lines exist for every syllable and word', () => {
    for (const w of ALL_SYLLABLE_WORDS) {
      expect(w.parts.join('').toLowerCase()).toBe(w.word);
      expect(() => line(w.line)).not.toThrow();
      for (const p of w.parts) expect(() => line(`suku_${p.toLowerCase()}`)).not.toThrow();
    }
  });
  it('3 different words; distractor tile at level 2+; 3-syllable words at top level', () => {
    for (let seed = 0; seed < 100; seed++) {
      const easy = makeBuildRound('4-5', createRng(seed), 0);
      expect(new Set(easy.map((q) => q.word.word)).size).toBe(3);
      for (const q of easy) { expect(q.word.parts).toHaveLength(2); expect(q.tiles).toHaveLength(2); }
      for (const q of makeBuildRound('4-5', createRng(seed), 2)) expect(q.tiles).toHaveLength(q.word.parts.length + 1);
    }
    const top = new Set<number>();
    for (let seed = 0; seed < 100; seed++) for (const q of makeBuildRound('4-5', createRng(seed), 3)) top.add(q.word.parts.length);
    expect(top.has(3)).toBe(true);
  });
});
