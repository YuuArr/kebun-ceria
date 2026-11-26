import { loadJSON, saveJSON } from './storage';

/** Rounds needed to fill one season's garden. */
export const GARDEN_STAGES = 20;
/** Drawn things revealed per round (the scenery has 120 steps). */
export const VISUAL_PER_ROUND = 6;
/** Theme order; after the last one the order repeats with a colour variation. */
export const THEMES = ['bunga', 'buah', 'laut', 'hutan'] as const;
export type ThemeId = (typeof THEMES)[number];

export interface AlbumEntry {
  theme: ThemeId;
  cycle: number;
  at: string;
}

interface GardenState {
  growth: number;
  seen: number;
  season: number;
  album: AlbumEntry[];
}

const KEY = 'garden';
const OLD_STAGES = 120;

const clampRounds = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? Math.max(0, Math.min(GARDEN_STAGES, Math.floor(n))) : 0);

function read(): GardenState {
  const s = loadJSON<Partial<GardenState> & { growth?: number }>(KEY, {});
  let growth = s.growth ?? 0;
  let seen = s.seen ?? 0;
  // Before seasons, growth counted 120 small steps; convert to rounds.
  if (s.season === undefined && growth > GARDEN_STAGES) {
    growth = Math.ceil((Math.min(growth, OLD_STAGES) / OLD_STAGES) * GARDEN_STAGES);
    seen = growth;
  }
  const g = clampRounds(growth);
  const album = Array.isArray(s.album) ? s.album.filter((a) => a && THEMES.includes(a.theme)) : [];
  return { growth: g, seen: Math.min(clampRounds(seen), g), season: clampSeason(s.season), album };
}
const clampSeason = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0);

// In-memory mirror so the garden survives within a session when storage is unavailable.
let memory: GardenState | null = null;
const current = () => memory ?? read();
const write = (s: GardenState) => {
  memory = s;
  saveJSON(KEY, s);
};

export function getGrowth(): number {
  return current().growth;
}

export const themeOf = (season: number): ThemeId => THEMES[season % THEMES.length];
export const cycleOf = (season: number): number => Math.floor(season / THEMES.length);

export function getSeason(): { season: number; theme: ThemeId; cycle: number } {
  const season = current().season;
  return { season, theme: themeOf(season), cycle: cycleOf(season) };
}

export const isFull = (): boolean => current().growth >= GARDEN_STAGES;

/** Adds one round of growth (called once per finished round). Does nothing once the season is full. */
export function grow(): { stage: number; isNew: boolean } {
  const s = current();
  if (s.growth >= GARDEN_STAGES) return { stage: GARDEN_STAGES, isNew: false };
  write({ ...s, growth: s.growth + 1 });
  return { stage: s.growth + 1, isNew: true };
}

/** Rounds grown but not yet shown with the "appear" animation. */
export function getUnseen(): number[] {
  const s = current();
  const out: number[] = [];
  for (let i = s.seen + 1; i <= s.growth; i++) out.push(i);
  return out;
}

export function markSeen(round: number): void {
  const s = current();
  write({ ...s, seen: Math.min(Math.max(s.seen, round), s.growth) });
}

/** Harvest: keep the full garden in the album and start the next season's theme from empty. */
export function harvest(now = new Date()): AlbumEntry | null {
  const s = current();
  if (s.growth < GARDEN_STAGES) return null;
  const entry: AlbumEntry = { theme: themeOf(s.season), cycle: cycleOf(s.season), at: now.toISOString() };
  write({ growth: 0, seen: 0, season: s.season + 1, album: [...s.album, entry] });
  return entry;
}

export const getAlbum = (): AlbumEntry[] => [...current().album];

/** Test helper: forget the in-memory mirror. */
export function _resetGardenMemory(): void {
  memory = null;
}
