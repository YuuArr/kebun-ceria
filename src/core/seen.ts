import type { Rng } from './rng';
import { loadJSON, saveJSON } from './storage';

/** How often each item (letter or word) has been shown, per game, so rarely seen ones come first. */
type Seen = Record<string, Record<string, number>>;
const KEY = 'seen';
let memory: Seen | null = null;

const read = (): Seen => {
  if (memory) return memory;
  const raw = loadJSON<unknown>(KEY, {});
  memory = raw && typeof raw === 'object' ? (raw as Seen) : {};
  return memory;
};

export const getSeen = (game: string): Record<string, number> => ({ ...(read()[game] ?? {}) });

export function markSeen(game: string, items: readonly string[]): void {
  const all = read();
  const g = { ...(all[game] ?? {}) };
  for (const it of items) g[it] = (g[it] ?? 0) + 1;
  memory = { ...all, [game]: g };
  saveJSON(KEY, memory);
}

/** k distinct items, least-seen first; ties broken randomly. */
export function pickFresh<T extends string>(pool: readonly T[], k: number, rng: Rng, seen: Record<string, number> = {}): T[] {
  return rng
    .shuffle(pool)
    .map((item, i) => ({ item, i, n: seen[item] ?? 0 }))
    .sort((a, b) => a.n - b.n || a.i - b.i)
    .slice(0, k)
    .map((x) => x.item);
}

export function _resetSeenMemory(): void {
  memory = null;
}
