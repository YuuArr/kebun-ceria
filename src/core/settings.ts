import { loadJSON, saveJSON } from './storage';

export type AgeGroup = '2-3' | '4-5';

export type LetterMode = 'bertahap' | 'semua';

export interface Settings {
  age: AgeGroup;
  /** 'bertahap' opens letters gradually; 'semua' shows A–Z from the start. */
  letters: LetterMode;
  /** Volumes 0–1. */
  music: number;
  voice: number;
  sfx: number;
}

const DEFAULTS: Settings = { age: '4-5', letters: 'bertahap', music: 0.4, voice: 1, sfx: 0.8 };
const KEY = 'settings';

const isVolume = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v <= 1;

export function getSettings(): Settings {
  const raw = loadJSON<Partial<Settings>>(KEY, {});
  return {
    age: raw.age === '2-3' || raw.age === '4-5' ? raw.age : DEFAULTS.age,
    letters: raw.letters === 'semua' ? 'semua' : 'bertahap',
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
