import type { CountObject } from '../content/lines';
import { s, svgRoot } from './svg';

const o = { stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' } as const;

const DRAW: Record<CountObject, () => SVGElement[]> = {
  bebek: () => [
    s('path', { d: 'M14 62 Q14 86 50 86 Q84 86 86 60 Q70 66 58 56 Z', fill: '#FDD835', ...o }),
    s('circle', { cx: 40, cy: 38, r: 18, fill: '#FDD835', ...o }),
    s('path', { d: 'M20 38 l-14 4 l14 6 z', fill: '#FFA94D', ...o, 'stroke-width': 3 }),
    s('circle', { cx: 36, cy: 34, r: 3.5, fill: '#4A3B3B' }),
    s('path', { d: 'M52 66 q12 -10 24 -2', fill: 'none', stroke: '#E0B400', 'stroke-width': 4, 'stroke-linecap': 'round' }),
  ],
  apel: () => [
    s('path', { d: 'M50 30 C30 18 10 32 14 56 C18 82 38 92 50 84 C62 92 82 82 86 56 C90 32 70 18 50 30 Z', fill: '#E53935', ...o }),
    s('path', { d: 'M50 30 Q52 18 58 10', fill: 'none', stroke: '#6D4C41', 'stroke-width': 5, 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 66, cy: 18, rx: 11, ry: 6, fill: '#43A047', transform: 'rotate(-25 66 18)', ...o, 'stroke-width': 3 }),
    s('ellipse', { cx: 32, cy: 46, rx: 6, ry: 10, fill: '#fff', opacity: 0.5 }),
  ],
  ikan: () => [
    s('path', { d: 'M76 50 L94 34 L94 66 Z', fill: '#FFA94D', ...o }),
    s('ellipse', { cx: 46, cy: 50, rx: 34, ry: 22, fill: '#FFA94D', ...o }),
    s('path', { d: 'M44 30 q8 -10 18 -2', fill: '#FFA94D', ...o, 'stroke-width': 3 }),
    s('circle', { cx: 26, cy: 46, r: 4, fill: '#4A3B3B' }),
    s('path', { d: 'M48 36 q8 14 0 28', fill: 'none', stroke: '#E07B1F', 'stroke-width': 3 }),
  ],
  bintang: () => [
    s('path', { d: 'M50 8 L61 36 L91 38 L68 57 L76 87 L50 70 L24 87 L32 57 L9 38 L39 36 Z', fill: '#FDD835', ...o }),
    s('circle', { cx: 42, cy: 50, r: 3.5, fill: '#4A3B3B' }),
    s('circle', { cx: 58, cy: 50, r: 3.5, fill: '#4A3B3B' }),
    s('path', { d: 'M44 60 q6 6 12 0', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ],
  bola: () => [
    s('circle', { cx: 50, cy: 50, r: 38, fill: '#1E88E5', ...o }),
    s('path', { d: 'M14 42 Q50 30 86 42 M14 58 Q50 70 86 58', fill: 'none', stroke: '#fff', 'stroke-width': 8 }),
    s('circle', { cx: 50, cy: 50, r: 38, fill: 'none', ...o }),
  ],
  kupu: () => [
    s('ellipse', { cx: 30, cy: 38, rx: 22, ry: 18, fill: '#FF8FB1', ...o }),
    s('ellipse', { cx: 70, cy: 38, rx: 22, ry: 18, fill: '#FF8FB1', ...o }),
    s('ellipse', { cx: 34, cy: 66, rx: 15, ry: 13, fill: '#AB47BC', ...o }),
    s('ellipse', { cx: 66, cy: 66, rx: 15, ry: 13, fill: '#AB47BC', ...o }),
    s('rect', { x: 45, y: 24, width: 10, height: 56, rx: 5, fill: '#4A3B3B' }),
    s('path', { d: 'M48 26 q-6 -14 -12 -16 M52 26 q6 -14 12 -16', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ],
};

export function countObject(kind: CountObject): SVGSVGElement {
  return svgRoot('0 0 100 100', DRAW[kind](), { class: `obj obj-${kind}` });
}
