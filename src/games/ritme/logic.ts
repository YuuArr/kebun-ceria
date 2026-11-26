import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

/** C major scale (C5…C6) with a colour per bar, as on toy xylophones. */
export const NOTES: readonly { freq: number; color: string; name: string }[] = [
  { freq: 523.25, color: '#E53935', name: 'do' },
  { freq: 587.33, color: '#FB8C00', name: 're' },
  { freq: 659.25, color: '#FDD835', name: 'mi' },
  { freq: 698.46, color: '#43A047', name: 'fa' },
  { freq: 783.99, color: '#1E88E5', name: 'sol' },
  { freq: 880.0, color: '#3949AB', name: 'la' },
  { freq: 987.77, color: '#8E24AA', name: 'si' },
  { freq: 1046.5, color: '#FF8FB1', name: 'do' },
];

const LENGTHS: Record<AgeGroup, number[][]> = {
  '2-3': [[2, 2, 3], [2, 3, 3], [2, 3, 3], [3, 3, 4]],
  '4-5': [[2, 3, 3], [3, 3, 4], [3, 4, 5], [4, 5, 5]],
};

/** Three melodies to echo back, on 3–5 bars. */
export function makeRhythmRound(age: AgeGroup, rng: Rng, level = 0): { bars: number; sequences: number[][] } {
  const L = Math.min(3, level);
  const bars = age === '2-3' ? 3 : L >= 2 ? 5 : 4;
  const make = (len: number) => {
    const seq: number[] = [];
    for (let i = 0; i < len; i++) {
      let n = rng.int(0, bars - 1);
      if (n === seq[i - 1] && rng.next() < 0.7) n = (n + 1) % bars; // mostly avoid repeats
      seq.push(n);
    }
    return seq;
  };
  const sequences: number[][] = [];
  for (const len of LENGTHS[age][L]) {
    let seq = make(len);
    while (sequences.length && seq.join() === sequences[sequences.length - 1].join()) seq = make(len);
    sequences.push(seq);
  }
  return { bars, sequences };
}

/** The child repeats a melody. A wrong bar restarts their turn (no failure). */
export function createEcho(seq: readonly number[]) {
  let pos = 0;
  return {
    press(bar: number): { ok: boolean; done: boolean } {
      if (bar !== seq[pos]) {
        pos = 0;
        return { ok: false, done: false };
      }
      pos++;
      return { ok: true, done: pos === seq.length };
    },
    reset() { pos = 0; },
  };
}
