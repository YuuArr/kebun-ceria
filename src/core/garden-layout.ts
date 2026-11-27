import { loadJSON, saveJSON } from './storage';

/** Where the child moved garden things, per season: { season: { key: [x, y] } }. */
type Layout = Record<string, Record<string, [number, number]>>;
const KEY = 'garden-pos';
let memory: Layout | null = null;
const read = (): Layout => (memory ??= loadJSON<Layout>(KEY, {}) || {});

export const ZONES = { sky: { minY: 40, maxY: 250 }, ground: { minY: 290, maxY: 540 } } as const;
export const MIN_X = 30;
export const MAX_X = 970;

/** Keeps sky things in the sky and ground things on the ground, inside the garden. */
export function clampToZone(zone: 'sky' | 'ground', x: number, y: number): [number, number] {
  const z = ZONES[zone];
  return [Math.round(Math.min(MAX_X, Math.max(MIN_X, x))), Math.round(Math.min(z.maxY, Math.max(z.minY, y)))];
}

export const getPositions = (season: number): Record<string, [number, number]> => ({ ...(read()[season] ?? {}) });

export function setPosition(season: number, key: string, x: number, y: number): void {
  const all = read();
  memory = { ...all, [season]: { ...(all[season] ?? {}), [key]: [x, y] } };
  saveJSON(KEY, memory);
}

export function _resetLayoutMemory(): void {
  memory = null;
}
