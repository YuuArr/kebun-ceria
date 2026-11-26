import type { ArtId } from '../../art/things';
import { SHAPES, type Shape } from '../../content/lines';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

/** Everyday things that have each shape. */
export const SHAPE_ITEMS: Record<Shape, readonly ArtId[]> = {
  lingkaran: ['donat', 'roda'],
  segitiga: ['pizza', 'topi-pesta'],
  persegi: ['kado', 'jendela'],
  'persegi-panjang': ['bata', 'pintu'],
  bintang: ['bintang-laut', 'bintang'],
  hati: ['kue-hati', 'balon-hati'],
};

export interface PostRound {
  holes: Shape[];
  items: { art: ArtId; shape: Shape }[];
}

const BASIC: Shape[] = ['lingkaran', 'segitiga', 'persegi'];

export function makePostRound(age: AgeGroup, rng: Rng): PostRound {
  if (age === '2-3') {
    const holes = rng.shuffle(BASIC);
    return { holes, items: rng.shuffle(holes.map((sh) => ({ art: rng.pick(SHAPE_ITEMS[sh]), shape: sh }))) };
  }
  const holes = rng.shuffle(SHAPES).slice(0, 3);
  return { holes, items: rng.shuffle(holes.flatMap((sh) => SHAPE_ITEMS[sh].map((art) => ({ art, shape: sh })))) };
}
