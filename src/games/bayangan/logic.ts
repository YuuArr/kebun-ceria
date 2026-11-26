import { ART_IDS, type ArtId } from '../../art/things';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';

export interface ShadowQ {
  art: ArtId;
  /** Silhouettes to choose from (contains `art` once). */
  options: ArtId[];
}

/** Things whose silhouettes look alike; never offered together. */
export const LOOKALIKES: readonly (readonly ArtId[])[] = [
  ['bola', 'jeruk', 'tomat', 'apel', 'donat', 'roda', 'telur', 'balon', 'ceri'],
  ['jendela', 'kado', 'bata', 'buku', 'roti', 'wafer', 'susu', 'pintu'],
  ['hati', 'kue-hati', 'balon-hati'],
  ['bintang', 'bintang-laut'],
  ['bebek', 'ayam'],
];
const group = (a: ArtId) => LOOKALIKES.find((g) => g.includes(a));
const alike = (a: ArtId, b: ArtId) => a === b || (group(a)?.includes(b) ?? false);

/** Five "which shadow belongs to this?" questions. */
export function makeShadowRound(age: AgeGroup, rng: Rng, level = 0, seen: Record<string, number> = {}): ShadowQ[] {
  const n = age === '2-3' ? (level >= 2 ? 3 : 2) : level >= 2 ? 4 : 3;
  const arts = pickFresh(ART_IDS, 5, rng, seen);
  return arts.map((art) => {
    const picked: ArtId[] = [art];
    for (const a of rng.shuffle(ART_IDS)) {
      if (picked.length >= n) break;
      if (!picked.some((p) => alike(p, a))) picked.push(a);
    }
    return { art, options: rng.shuffle(picked) };
  });
}
