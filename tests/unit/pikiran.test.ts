import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { createMemory, makeMemoryDeck } from '../../src/games/memori/logic';
import { makeOrderRound } from '../../src/games/urutkan/logic';
import { makeMissingRound } from '../../src/games/hilang/logic';

describe('Cari Pasangan', () => {
  it('deck has pairs; size grows with level', () => {
    expect(makeMemoryDeck('2-3', createRng(1), 0)).toHaveLength(4);
    expect(makeMemoryDeck('4-5', createRng(1), 0)).toHaveLength(6);
    expect(makeMemoryDeck('4-5', createRng(1), 3)).toHaveLength(16);
    const d = makeMemoryDeck('4-5', createRng(2), 2);
    for (const a of new Set(d)) expect(d.filter((x) => x === a)).toHaveLength(2);
  });
  it('flip logic: match stays, miss flips back, done when all matched', () => {
    const m = createMemory(['a', 'b', 'a', 'b']);
    expect(m.flip(0).kind).toBe('first');
    expect(m.flip(0).kind).toBe('ignored');
    expect(m.flip(1).kind).toBe('miss');
    expect(m.flip(0).kind).toBe('first');
    const r = m.flip(2);
    expect(r.kind).toBe('match');
    expect(m.flip(2).kind).toBe('ignored');
    m.flip(1);
    expect(m.flip(3)).toMatchObject({ kind: 'match', done: true });
  });
});

describe('Urutkan Kecil-Besar', () => {
  it('3 steps; sizes distinct; count by age/level', () => {
    for (let seed = 0; seed < 50; seed++) {
      const r = makeOrderRound('2-3', createRng(seed), 0);
      expect(r).toHaveLength(3);
      for (const st of r) expect(st.sizes).toHaveLength(3);
      for (const st of makeOrderRound('4-5', createRng(seed), 2)) expect(st.sizes).toHaveLength(5);
    }
  });
});

describe('Apa yang Hilang?', () => {
  it('missing item was shown, is not left, and is offered once', () => {
    for (let seed = 0; seed < 200; seed++) {
      for (const q of makeMissingRound('4-5', createRng(seed), 1)) {
        expect(q.shown).toContain(q.missing);
        expect(q.shown).toHaveLength(4);
        expect(q.options.filter((o) => o === q.missing)).toHaveLength(1);
        for (const o of q.options) if (o !== q.missing) expect(q.shown).not.toContain(o);
      }
    }
  });
});
