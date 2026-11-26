import { loadJSON, saveJSON } from './storage';

export type AgeGroup = '2-3' | '4-5';

export interface Settings {
  age: AgeGroup;
  /** Volumes 0–1. */
  music: number;
  voice: number;
  sfx: number;
}

const DEFAULTS: Settings = { age: '4-5', music: 0.4, voice: 1, sfx: 0.8 };
const KEY = 'settings';

const isVolume = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v <= 1;

export function getSettings(): Settings {
  const raw = loadJSON<Partial<Settings>>(KEY, {});
  return {
    age: raw.age === '2-3' || raw.age === '4-5' ? raw.age : DEFAULTS.age,
    music: isVolume(raw.music) ? raw.music : DEFAULTS.music,
    voice: isVolume(raw.voice) ? raw.voice : DEFAULTS.voice,
    sfx: isVolume(raw.sfx) ? raw.sfx : DEFAULTS.sfx,
  };
}

export function updateSettings(patch: Partial<Settings>): Settings {
  const next = { ...getSettings(), ...patch };
  saveJSON(KEY, next);
  return next;
}
