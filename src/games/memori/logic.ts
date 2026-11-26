import { ART_IDS, type ArtId } from '../../art/things';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';

const PAIRS: Record<AgeGroup, number[]> = { '2-3': [2, 3, 3, 4], '4-5': [3, 4, 6, 8] };

export function makeMemoryDeck(age: AgeGroup, rng: Rng, level = 0, seen: Record<string, number> = {}): ArtId[] {
  const arts = pickFresh(ART_IDS, PAIRS[age][Math.min(3, level)], rng, seen);
  return rng.shuffle([...arts, ...arts]);
}

export type FlipResult = { kind: 'first' } | { kind: 'ignored' } | { kind: 'match'; pair: [number, number]; done: boolean } | { kind: 'miss'; pair: [number, number] };

/** Classic memory: flip two; a match stays open, a miss is reported so the view can flip them back. */
export function createMemory<T>(deck: readonly T[]) {
  const matched = new Set<number>();
  let open: number | null = null;
  return {
    flip(i: number): FlipResult {
      if (matched.has(i) || i === open || i < 0 || i >= deck.length) return { kind: 'ignored' };
      if (open === null) { open = i; return { kind: 'first' }; }
      const a = open;
      open = null;
      if (deck[a] === deck[i]) {
        matched.add(a); matched.add(i);
        return { kind: 'match', pair: [a, i], done: matched.size === deck.length };
      }
      return { kind: 'miss', pair: [a, i] };
    },
  };
}
