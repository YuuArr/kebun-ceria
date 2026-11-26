import { s, svgRoot } from './svg';

const outline = { stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' } as const;

/** Pondok Huruf: a little house with an "A" sign. */
export function houseIcon(): SVGSVGElement {
  return svgRoot('0 0 120 120', [
    s('rect', { x: 22, y: 52, width: 76, height: 56, rx: 6, fill: '#FFCC80', ...outline }),
    s('path', { d: 'M12 58 L60 16 L108 58 Z', fill: '#E57373', ...outline }),
    s('rect', { x: 50, y: 76, width: 22, height: 32, rx: 4, fill: '#A0673D', ...outline }),
    s('rect', { x: 38, y: 34, width: 44, height: 30, rx: 6, fill: '#fff', ...outline, 'stroke-width': 3 }),
    s('text', { x: 60, y: 58, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 700, fill: '#1E88E5', 'font-family': 'Andika, sans-serif' }, ['A']),
  ]);
}

/** Kolam Angka: a pond with a duck and numbered stones. */
export function pondIcon(): SVGSVGElement {
  return svgRoot('0 0 120 120', [
    s('ellipse', { cx: 60, cy: 78, rx: 52, ry: 32, fill: '#6EC6F0', ...outline }),
    s('ellipse', { cx: 48, cy: 76, rx: 18, ry: 11, fill: '#FDD835', ...outline, 'stroke-width': 3 }),
    s('circle', { cx: 62, cy: 62, r: 10, fill: '#FDD835', ...outline, 'stroke-width': 3 }),
    s('path', { d: 'M70 62 l10 3 l-10 3 z', fill: '#FFA94D' }),
    s('circle', { cx: 64, cy: 59, r: 2, fill: '#4A3B3B' }),
    ...[1, 2, 3].map((n, i) =>
      s('g', { transform: `translate(${26 + i * 34} 26)` }, [
        s('circle', { r: 14, fill: '#fff', ...outline, 'stroke-width': 3 }),
        s('text', { y: 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#E53935', 'font-family': 'Andika, sans-serif' }, [String(n)]),
      ]),
    ),
  ]);
}

/** Taman Warna: a flowerbed with coloured shapes. */
export function flowerbedIcon(): SVGSVGElement {
  return svgRoot('0 0 120 120', [
    s('rect', { x: 10, y: 78, width: 100, height: 30, rx: 10, fill: '#A0673D', ...outline }),
    s('circle', { cx: 32, cy: 52, r: 16, fill: '#E53935', ...outline }),
    s('path', { d: 'M60 30 L78 64 H42 Z', fill: '#FDD835', ...outline }),
    s('rect', { x: 74, y: 40, width: 28, height: 28, rx: 3, fill: '#1E88E5', ...outline }),
    ...[30, 60, 88].map((x) => s('path', { d: `M${x} 78 V66`, stroke: '#2E7D32', 'stroke-width': 5 })),
  ]);
}

export function homeIcon(): SVGSVGElement {
  return svgRoot('0 0 64 64', [
    s('path', { d: 'M10 30 L32 10 L54 30 V54 H10 Z', fill: '#FFCC80', ...outline }),
    s('rect', { x: 26, y: 36, width: 12, height: 18, fill: '#A0673D' }),
  ]);
}

export function earIcon(): SVGSVGElement {
  return svgRoot('0 0 64 64', [
    s('path', { d: 'M14 26 h10 l14 -12 v36 l-14 -12 h-10 z', fill: '#FFCC80', ...outline }),
    s('path', { d: 'M44 22 q8 10 0 20 M50 16 q14 16 0 32', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linecap': 'round' }),
  ]);
}
