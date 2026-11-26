import { loadJSON, saveJSON } from './storage';

/** Rounds needed per level step; levels only go up. */
export const ROUNDS_PER_LEVEL = 3;
export const MAX_LEVEL = 3;
const KEY = 'progress';

type Progress = Record<string, number>;
let memory: Progress | null = null;

const read = (): Progress => {
  if (memory) return memory;
  const raw = loadJSON<unknown>(KEY, {});
  const clean: Progress = {};
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw)) if (typeof v === 'number' && v >= 0) clean[k] = Math.floor(v);
  }
  memory = clean;
  return clean;
};

export const getRounds = (game: string): number => read()[game] ?? 0;

export const getLevel = (game: string): number => Math.min(MAX_LEVEL, Math.floor(getRounds(game) / ROUNDS_PER_LEVEL));

export function addRound(game: string): void {
  const p = { ...read(), [game]: getRounds(game) + 1 };
  memory = p;
  saveJSON(KEY, p);
}

/** Test helper. */
export function _resetProgressMemory(): void {
  memory = null;
}
