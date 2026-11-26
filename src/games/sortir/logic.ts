import type { ArtId } from '../../art/things';
import { COLORS, type ColorId } from '../../content/lines';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

/** Things whose natural colour children know. */
export const COLOR_ITEMS: Record<ColorId, readonly ArtId[]> = {
  merah: ['apel', 'stroberi', 'tomat'],
  kuning: ['pisang', 'bebek', 'bintang'],
  biru: ['bola', 'balon', 'ember'],
  hijau: ['daun', 'katak', 'brokoli'],
};

export interface SortRound {
  colors: ColorId[];
  items: { art: ArtId; color: ColorId }[];
}

export function makeSortRound(age: AgeGroup, rng: Rng, level = 0): SortRound {
  const big = level >= 2;
  const colors = rng.shuffle(COLORS).slice(0, age === '2-3' ? 2 : big ? 4 : 3);
  const per = age === '2-3' && big ? 3 : 2;
  const items = colors.flatMap((c) => rng.shuffle(COLOR_ITEMS[c]).slice(0, per).map((art) => ({ art, color: c })));
  return { colors, items: rng.shuffle(items) };
}
