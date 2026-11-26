import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { createEcho, makeRhythmRound, NOTES } from '../../src/games/ritme/logic';
import { createAudio } from '../../src/core/audio';

describe('Tiru Ritme', () => {
  it('3 sequences that use only the visible bars and grow with level', () => {
    for (let seed = 0; seed < 100; seed++) {
      const r = makeRhythmRound('2-3', createRng(seed), 0);
      expect(r.bars).toBe(3);
      expect(r.sequences.map((s) => s.length)).toEqual([2, 2, 3]);
      for (const s of r.sequences) for (const n of s) expect(n).toBeLessThan(r.bars);
      expect(makeRhythmRound('4-5', createRng(seed), 3).sequences.map((s) => s.length)).toEqual([4, 5, 5]);
    }
    expect(NOTES.length).toBeGreaterThanOrEqual(8);
  });
  it('echo: wrong tap restarts the turn without failing; right taps finish', () => {
    const e = createEcho([0, 2, 1]);
    expect(e.press(0)).toEqual({ ok: true, done: false });
    expect(e.press(1)).toEqual({ ok: false, done: false });
    expect(e.press(0)).toEqual({ ok: true, done: false });
    expect(e.press(2)).toEqual({ ok: true, done: false });
    expect(e.press(1)).toEqual({ ok: true, done: true });
  });
  it('tones and drums never throw without Web Audio', () => {
    const a = createAudio({ Howl: class { play() { return 1; } stop() {} volume() {} } as never, speech: null });
    expect(() => { a.tone(440); a.drum('kick'); a.drum('tambourine'); }).not.toThrow();
  });
});
