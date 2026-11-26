import type { ColorId } from '../content/lines';
import { s, svgRoot } from './svg';

export const HEX: Record<ColorId, string> = { merah: '#E53935', kuning: '#FDD835', biru: '#1E88E5', hijau: '#43A047' };

/** Each colour also has its own shape, so colour-blind children can tell them apart. */
export const COLOR_SHAPE: Record<ColorId, string> = {
  merah: 'M50 34 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0', // lingkaran
  kuning: 'M50 18 L54 29 L66 30 L57 38 L60 50 L50 43 L40 50 L43 38 L34 30 L46 29 Z', // bintang
  biru: 'M50 18 Q64 36 62 42 A12 12 0 0 1 38 42 Q36 36 50 18 Z', // tetes
  hijau: 'M36 46 Q36 22 64 20 Q64 46 36 46 Z M38 44 L56 28', // daun
};

/** A woven basket in the given colour with its shape badge. */
export function basket(color: ColorId): SVGSVGElement {
  const o = { stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' } as const;
  return svgRoot('0 0 120 100', [
    s('path', { d: 'M30 40 Q60 -6 90 40', fill: 'none', ...o, 'stroke-width': 6 }),
    s('path', { d: 'M10 40 H110 L98 94 H22 Z', fill: HEX[color], ...o }),
    s('path', { d: 'M16 56 H104 M20 74 H100', stroke: 'rgba(0,0,0,.18)', 'stroke-width': 4 }),
    s('g', { transform: 'translate(10 34)' }, [s('path', { d: COLOR_SHAPE[color], fill: '#fff', stroke: '#fff', 'stroke-width': 2 })]),
  ]);
}
