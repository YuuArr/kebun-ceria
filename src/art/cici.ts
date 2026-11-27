import { getSeason } from '../core/garden';
import { s, svgRoot } from './svg';

export type CiciMood = 'happy' | 'cheer';
export type Costume = 'bunga' | 'buah' | 'laut' | 'hutan' | 'angkasa';

const line = '#4A3B3B';
const o = { stroke: line, 'stroke-width': 4, 'stroke-linejoin': 'round' } as const;

/** Outfit drawn over the body (after the arms). */
function outfitBody(c: Costume): SVGElement[] {
  switch (c) {
    case 'buah': // farmer overalls
      return [
        s('path', { d: 'M70 184 H130 V214 Q100 236 70 214 Z', fill: '#42A5F5', ...o, 'stroke-width': 3 }),
        s('path', { d: 'M76 186 L70 156 M124 186 L130 156', stroke: '#1E88E5', 'stroke-width': 6, 'stroke-linecap': 'round' }),
        s('circle', { cx: 86, cy: 192, r: 3, fill: '#FDD835' }), s('circle', { cx: 114, cy: 192, r: 3, fill: '#FDD835' }),
      ];
    case 'hutan': // explorer scarf
      return [s('path', { d: 'M66 160 Q100 178 134 160 L132 172 Q100 190 68 172 Z', fill: '#43A047', ...o, 'stroke-width': 3 }), s('path', { d: 'M118 172 l8 22 l-14 -6 Z', fill: '#43A047', ...o, 'stroke-width': 3 })];
    case 'angkasa': // space suit
      return [
        s('ellipse', { cx: 100, cy: 192, rx: 46, ry: 42, fill: '#ECEFF1', ...o }),
        s('rect', { x: 84, y: 178, width: 32, height: 22, rx: 6, fill: '#90CAF9', ...o, 'stroke-width': 3 }),
        s('circle', { cx: 92, cy: 189, r: 3, fill: '#E53935' }), s('circle', { cx: 104, cy: 189, r: 3, fill: '#FDD835' }),
      ];
    case 'laut': // little swim ring
      return [s('ellipse', { cx: 100, cy: 206, rx: 48, ry: 14, fill: 'none', stroke: '#E53935', 'stroke-width': 12 }), s('path', { d: 'M62 202 v10 M100 192 v10 M138 202 v10', stroke: '#fff', 'stroke-width': 7 })];
    default:
      return [];
  }
}

/** Accessories drawn over the head. */
function outfitHead(c: Costume): SVGElement[] {
  switch (c) {
    case 'buah': // straw hat
      return [
        s('ellipse', { cx: 100, cy: 78, rx: 66, ry: 13, fill: '#FFD54F', ...o }),
        s('path', { d: 'M66 78 Q66 44 100 44 Q134 44 134 78 Z', fill: '#FFE082', ...o }),
        s('path', { d: 'M67 70 Q100 78 133 70', fill: 'none', stroke: '#E53935', 'stroke-width': 7 }),
      ];
    case 'laut': // snorkel mask
      return [
        s('path', { d: 'M52 106 H148', stroke: '#26C6DA', 'stroke-width': 7 }),
        s('rect', { x: 68, y: 96, width: 64, height: 30, rx: 13, fill: '#B2EBF2', opacity: 0.75, ...o, 'stroke-width': 3 }),
        s('path', { d: 'M140 112 V64 Q140 56 148 56', fill: 'none', stroke: '#FFA726', 'stroke-width': 7, 'stroke-linecap': 'round' }),
      ];
    case 'hutan': // explorer hat
      return [
        s('ellipse', { cx: 100, cy: 80, rx: 60, ry: 11, fill: '#A1887F', ...o }),
        s('path', { d: 'M70 80 Q70 50 100 48 Q130 50 130 80 Z', fill: '#BCAAA4', ...o }),
        s('path', { d: 'M71 72 H129', stroke: '#6D4C41', 'stroke-width': 6 }),
      ];
    case 'angkasa': // helmet
      return [
        s('circle', { cx: 100, cy: 108, r: 72, fill: '#E3F2FD', opacity: 0.35, stroke: '#90A4AE', 'stroke-width': 5 }),
        s('path', { d: 'M58 80 Q70 52 100 46', fill: 'none', stroke: '#fff', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.8 }),
        s('path', { d: 'M100 36 V16', stroke: '#90A4AE', 'stroke-width': 4 }), s('circle', { cx: 100, cy: 12, r: 6, fill: '#E53935' }),
      ];
    default: // flower on the ear
      return [s('g', { transform: 'translate(138 30)' }, [
        ...[0, 72, 144, 216, 288].map((a) => s('circle', { cx: 0, cy: -8, r: 7, fill: '#FFD54F', transform: `rotate(${a})` })),
        s('circle', { r: 5, fill: '#FF8A65' }),
      ])];
  }
}

/** The outfit for the current garden theme. */
export const currentCostume = (): Costume => getSeason().theme as Costume;

/** Cici the rabbit, the guide mascot. Original drawing. Dressed for the current theme unless told otherwise. */
export function cici(mood: CiciMood = 'happy', costume: Costume = currentCostume()): SVGSVGElement {
  const fur = '#FFFFFF';
  const pink = '#FFB3C7';
  const arms =
    mood === 'cheer'
      ? [
          s('path', { d: 'M62 150 Q40 120 44 98', stroke: line, 'stroke-width': 5, fill: fur, 'stroke-linecap': 'round' }),
          s('path', { d: 'M138 150 Q160 120 156 98', stroke: line, 'stroke-width': 5, fill: fur, 'stroke-linecap': 'round' }),
        ]
      : [
          s('ellipse', { cx: 66, cy: 170, rx: 12, ry: 18, fill: fur, stroke: line, 'stroke-width': 4 }),
          s('ellipse', { cx: 134, cy: 170, rx: 12, ry: 18, fill: fur, stroke: line, 'stroke-width': 4 }),
        ];
  return svgRoot('0 0 200 240', [
    // ears
    s('g', { class: 'cici-ears' }, [
      s('ellipse', { cx: 72, cy: 52, rx: 18, ry: 48, fill: fur, stroke: line, 'stroke-width': 4, transform: 'rotate(-12 72 52)' }),
      s('ellipse', { cx: 72, cy: 56, rx: 8, ry: 34, fill: pink, transform: 'rotate(-12 72 56)' }),
      s('ellipse', { cx: 128, cy: 52, rx: 18, ry: 48, fill: fur, stroke: line, 'stroke-width': 4, transform: 'rotate(12 128 52)' }),
      s('ellipse', { cx: 128, cy: 56, rx: 8, ry: 34, fill: pink, transform: 'rotate(12 128 56)' }),
    ]),
    // body
    s('ellipse', { cx: 100, cy: 190, rx: 46, ry: 44, fill: fur, stroke: line, 'stroke-width': 4 }),
    s('ellipse', { cx: 100, cy: 198, rx: 26, ry: 26, fill: '#FFF1F5' }),
    ...arms,
    ...outfitBody(costume),
    // feet
    s('ellipse', { cx: 76, cy: 230, rx: 20, ry: 9, fill: fur, stroke: line, 'stroke-width': 4 }),
    s('ellipse', { cx: 124, cy: 230, rx: 20, ry: 9, fill: fur, stroke: line, 'stroke-width': 4 }),
    // head
    s('circle', { cx: 100, cy: 118, r: 50, fill: fur, stroke: line, 'stroke-width': 4 }),
    // eyes (grouped so they can blink)
    s('g', { class: 'cici-eyes' }, [
      s('ellipse', { cx: 82, cy: 112, rx: 7, ry: 9, fill: line }),
      s('ellipse', { cx: 118, cy: 112, rx: 7, ry: 9, fill: line }),
      s('circle', { cx: 84, cy: 109, r: 2.5, fill: '#fff' }),
      s('circle', { cx: 120, cy: 109, r: 2.5, fill: '#fff' }),
    ]),
    // cheeks
    s('ellipse', { cx: 70, cy: 132, rx: 9, ry: 6, fill: pink, opacity: 0.8 }),
    s('ellipse', { cx: 130, cy: 132, rx: 9, ry: 6, fill: pink, opacity: 0.8 }),
    // nose + mouth
    s('path', { d: 'M95 124 h10 l-5 6 z', fill: '#FF7FA3' }),
    s('path', { d: 'M100 130 q-8 10 -14 4 M100 130 q8 10 14 4', fill: 'none', stroke: line, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    ...outfitHead(costume),
  ], { class: `cici costume-${costume}` });
}
