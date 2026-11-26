import { s, svgRoot } from './svg';

const o = { stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' } as const;

/** Original monkey character with a big open mouth (the drop target sits over it). */
export function monyet(): SVGSVGElement {
  return svgRoot('0 0 200 220', [
    s('path', { d: 'M150 170 Q196 160 186 112 Q182 96 170 104', fill: 'none', stroke: '#8D5A33', 'stroke-width': 10, 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 100, cy: 172, rx: 52, ry: 44, fill: '#A0673D', ...o }),
    s('ellipse', { cx: 100, cy: 180, rx: 32, ry: 30, fill: '#E8C9A0' }),
    s('circle', { cx: 38, cy: 84, r: 22, fill: '#A0673D', ...o }), s('circle', { cx: 38, cy: 84, r: 11, fill: '#E8C9A0' }),
    s('circle', { cx: 162, cy: 84, r: 22, fill: '#A0673D', ...o }), s('circle', { cx: 162, cy: 84, r: 11, fill: '#E8C9A0' }),
    s('circle', { cx: 100, cy: 84, r: 60, fill: '#A0673D', ...o }),
    s('path', { d: 'M62 84 Q62 52 86 56 Q100 62 114 56 Q138 52 138 84 Q138 128 100 130 Q62 128 62 84 Z', fill: '#E8C9A0' }),
    s('g', { class: 'monyet-eyes' }, [
      s('ellipse', { cx: 84, cy: 78, rx: 7, ry: 9, fill: '#4A3B3B' }), s('ellipse', { cx: 116, cy: 78, rx: 7, ry: 9, fill: '#4A3B3B' }),
      s('circle', { cx: 86, cy: 75, r: 2.5, fill: '#fff' }), s('circle', { cx: 118, cy: 75, r: 2.5, fill: '#fff' }),
    ]),
    s('ellipse', { cx: 100, cy: 96, rx: 6, ry: 4, fill: '#4A3B3B' }),
    s('ellipse', { class: 'monyet-mouth', cx: 100, cy: 114, rx: 18, ry: 12, fill: '#8B2E2E', ...o, 'stroke-width': 3 }),
    s('ellipse', { cx: 100, cy: 120, rx: 10, ry: 5, fill: '#FF8FB1' }),
  ], { class: 'monyet' });
}
