import type { Shape } from '../content/lines';
import { s, svgRoot } from './svg';

/** Basic geometric shapes in a 100×100 box. */
export const SHAPE_PATHS: Record<Shape, string> = {
  lingkaran: 'M50 10 A40 40 0 1 1 49.9 10 Z',
  segitiga: 'M50 10 L92 88 H8 Z',
  persegi: 'M14 14 H86 V86 H14 Z',
  'persegi-panjang': 'M4 28 H96 V72 H4 Z',
  bintang: 'M50 6 L62 38 L96 40 L69 61 L79 94 L50 75 L21 94 L31 61 L4 40 L38 38 Z',
  hati: 'M50 90 C6 60 8 18 32 16 Q46 16 50 30 Q54 16 68 16 C92 18 94 60 50 90 Z',
};

export function shapeSvg(shape: Shape, fill: string, stroke = '#4A3B3B'): SVGSVGElement {
  return svgRoot('0 0 100 100', [s('path', { d: SHAPE_PATHS[shape], fill, stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' })]);
}
