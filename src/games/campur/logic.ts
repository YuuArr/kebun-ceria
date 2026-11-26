import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export type Primary = 'merah' | 'kuning' | 'biru';
export type Secondary = 'oranye' | 'hijau' | 'ungu';
export type MixColor = Primary | Secondary;

export const MIX_HEX: Record<MixColor, string> = {
  merah: '#E53935', kuning: '#FDD835', biru: '#1E88E5', oranye: '#FB8C00', hijau: '#43A047', ungu: '#8E24AA',
};

export function mix(a: Primary, b: Primary): MixColor {
  if (a === b) return a;
  const set = new Set([a, b]);
  if (set.has('merah') && set.has('kuning')) return 'oranye';
  if (set.has('kuning') && set.has('biru')) return 'hijau';
  return 'ungu';
}

/** 4–5: make each secondary colour once. 2–3: three free mixes. */
export function makeMixRound(age: AgeGroup, rng: Rng): { mode: 'target' | 'bebas'; targets: Secondary[] } {
  if (age === '2-3') return { mode: 'bebas', targets: [] };
  return { mode: 'target', targets: rng.shuffle(['oranye', 'hijau', 'ungu'] as Secondary[]) };
}
