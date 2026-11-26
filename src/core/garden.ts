import { loadJSON, saveJSON } from './storage';

/** Number of growth stages drawn on the garden map. The garden never shrinks. */
export const GARDEN_STAGES = 40;

interface GardenState {
  growth: number;
  seen: number;
}

const KEY = 'garden';

function read(): GardenState {
  const s = loadJSON<Partial<GardenState>>(KEY, {});
  const growth = clamp(s.growth ?? 0);
  return { growth, seen: Math.min(clamp(s.seen ?? 0), growth) };
}

const clamp = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(GARDEN_STAGES, Math.floor(n))) : 0);

// In-memory mirror so growth survives within a session when storage is unavailable.
let memory: GardenState | null = null;
const current = () => memory ?? read();
const write = (s: GardenState) => {
  memory = s;
  saveJSON(KEY, s);
};

export function getGrowth(): number {
  return current().growth;
}

/** Adds one stage (called once per finished round). */
export function grow(): { stage: number; isNew: boolean } {
  const s = current();
  if (s.growth >= GARDEN_STAGES) return { stage: GARDEN_STAGES, isNew: false };
  write({ ...s, growth: s.growth + 1 });
  return { stage: s.growth + 1, isNew: true };
}

/** Stages grown but not yet shown with the "appear" animation. */
export function getUnseen(): number[] {
  const s = current();
  const out: number[] = [];
  for (let i = s.seen + 1; i <= s.growth; i++) out.push(i);
  return out;
}

export function markSeen(stage: number): void {
  const s = current();
  write({ ...s, seen: Math.min(Math.max(s.seen, stage), s.growth) });
}

/** Test helper: forget the in-memory mirror. */
export function _resetGardenMemory(): void {
  memory = null;
}
