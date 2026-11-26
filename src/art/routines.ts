import { s, svgRoot } from './svg';

const o = { stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' } as const;
const hand = (x: number, y: number, flip = false) =>
  s('path', { d: 'M0 0 Q-4 -22 4 -24 Q8 -34 14 -24 Q20 -34 26 -22 Q32 -28 34 -14 L34 4 Q34 20 18 22 Q2 22 0 0 Z', fill: '#FFE0B2', ...o, 'stroke-width': 3, transform: `translate(${x} ${y}) ${flip ? 'scale(-1 1)' : ''}` });
const bubbles = (pts: [number, number, number][]) => pts.map(([x, y, r]) => s('circle', { cx: x, cy: y, r, fill: '#E3F2FD', ...o, 'stroke-width': 2 }));
const drops = (pts: [number, number][]) => pts.map(([x, y]) => s('path', { d: `M${x} ${y} q-5 8 0 10 q5 -2 0 -10 z`, fill: '#4FC3F7' }));

const DRAW: Record<string, () => SVGElement[]> = {
  tangan_keran: () => [
    s('path', { d: 'M20 20 H62 Q74 20 74 32 V40 H62 V32 H20 Z', fill: '#B0BEC5', ...o }),
    s('rect', { x: 34, y: 10, width: 16, height: 10, rx: 3, fill: '#E53935', ...o, 'stroke-width': 3 }),
    ...drops([[68, 50], [64, 66], [72, 78]]),
    hand(54, 92),
  ],
  tangan_sabun: () => [
    s('rect', { x: 20, y: 46, width: 52, height: 30, rx: 12, fill: '#FF8FB1', ...o }),
    ...bubbles([[30, 34, 8], [48, 26, 10], [68, 34, 7], [80, 52, 6]]),
  ],
  tangan_gosok: () => [hand(16, 70), hand(84, 70, true), ...bubbles([[50, 40, 9], [36, 30, 6], [64, 28, 7], [50, 64, 6]])],
  tangan_bilas: () => [
    s('path', { d: 'M40 6 V40 M50 6 V44 M60 6 V40', stroke: '#4FC3F7', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    hand(22, 84), hand(78, 84, true), ...drops([[30, 54], [70, 56]]),
  ],
  tangan_lap: () => [
    s('path', { d: 'M18 20 H82 V78 Q66 70 50 78 Q34 86 18 78 Z', fill: '#81C784', ...o }),
    s('path', { d: 'M18 36 H82 M18 44 H82', stroke: '#fff', 'stroke-width': 4 }),
    hand(40, 94),
  ],
  gigi_pasta: () => [
    s('rect', { x: 10, y: 54, width: 66, height: 12, rx: 6, fill: '#1E88E5', ...o }),
    s('rect', { x: 60, y: 40, width: 26, height: 16, rx: 4, fill: '#fff', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M60 40 Q64 28 74 32 Q82 22 86 36', fill: 'none', stroke: '#4FC3F7', 'stroke-width': 7, 'stroke-linecap': 'round' }),
    s('path', { d: 'M20 14 H52 L60 26 H28 Z', fill: '#E53935', ...o, 'stroke-width': 3 }),
  ],
  gigi_sikat: () => [
    s('path', { d: 'M26 20 Q26 6 40 8 Q50 14 60 8 Q74 6 74 20 Q74 40 66 58 Q62 70 58 58 Q54 44 50 44 Q46 44 42 58 Q38 70 34 58 Q26 40 26 20 Z', fill: '#fff', ...o }),
    s('circle', { cx: 42, cy: 24, r: 3, fill: '#4A3B3B' }), s('circle', { cx: 58, cy: 24, r: 3, fill: '#4A3B3B' }),
    s('path', { d: 'M44 32 Q50 38 56 32', fill: 'none', ...o, 'stroke-width': 2.5 }),
    s('rect', { x: 52, y: 70, width: 44, height: 9, rx: 4, fill: '#1E88E5', ...o, 'stroke-width': 3, transform: 'rotate(-30 74 74)' }),
    ...bubbles([[78, 48, 5], [86, 60, 4]]),
  ],
  gigi_kumur: () => [
    s('path', { d: 'M28 30 H72 L66 90 H34 Z', fill: '#E3F2FD', ...o }),
    s('path', { d: 'M31 50 H69 L66 90 H34 Z', fill: '#4FC3F7' }),
    ...drops([[44, 14], [56, 10]]),
  ],
  gigi_senyum: () => [
    s('path', { d: 'M26 26 Q26 12 40 14 Q50 20 60 14 Q74 12 74 26 Q74 46 66 64 Q62 76 58 64 Q54 50 50 50 Q46 50 42 64 Q38 76 34 64 Q26 46 26 26 Z', fill: '#fff', ...o }),
    s('circle', { cx: 42, cy: 30, r: 3, fill: '#4A3B3B' }), s('circle', { cx: 58, cy: 30, r: 3, fill: '#4A3B3B' }),
    s('path', { d: 'M42 38 Q50 46 58 38', fill: 'none', ...o, 'stroke-width': 2.5 }),
    s('path', { d: 'M82 14 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z M16 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z', fill: '#FDD835' }),
  ],
  baju_kaos: () => [s('path', { d: 'M30 14 L12 28 L22 44 L30 38 V88 H70 V38 L78 44 L88 28 L70 14 Q60 24 50 24 Q40 24 30 14 Z', fill: '#FFA94D', ...o })],
  baju_celana: () => [s('path', { d: 'M26 12 H74 L80 90 H58 L50 40 L42 90 H20 Z', fill: '#1E88E5', ...o }), s('path', { d: 'M26 22 H74', ...o, 'stroke-width': 3 })],
  baju_kaus: () => [
    s('path', { d: 'M24 10 H44 V58 L58 70 Q64 80 54 86 L32 86 Q20 86 22 74 Z', fill: '#E53935', ...o }),
    s('path', { d: 'M56 14 H76 V58 L90 70 Q96 80 86 86 L64 86', fill: '#E53935', ...o }),
    s('path', { d: 'M24 18 H44 M56 22 H76', stroke: '#fff', 'stroke-width': 4 }),
  ],
  baju_sepatu: () => [
    s('path', { d: 'M8 70 V48 Q8 40 18 40 H28 Q32 54 48 58 L58 60 Q66 62 66 70 V76 H8 Z', fill: '#AB47BC', ...o }),
    s('path', { d: 'M40 70 V48 Q40 40 50 40 H60 Q64 54 80 58 L90 60 Q98 62 98 70 V76 H40 Z', fill: '#AB47BC', ...o }),
    s('path', { d: 'M8 76 H66 M40 76 H98', stroke: '#fff', 'stroke-width': 4 }),
  ],
  permen: () => [
    s('path', { d: 'M30 50 L10 36 V64 Z M70 50 L90 36 V64 Z', fill: '#FF8FB1', ...o }),
    s('circle', { cx: 50, cy: 50, r: 22, fill: '#E53935', ...o }),
    s('path', { d: 'M36 40 Q50 50 64 40 M36 60 Q50 50 64 60', fill: 'none', stroke: '#fff', 'stroke-width': 4 }),
  ],
  soda: () => [
    s('rect', { x: 30, y: 14, width: 40, height: 74, rx: 8, fill: '#E53935', ...o }),
    s('rect', { x: 30, y: 38, width: 40, height: 24, fill: '#fff' }),
    s('path', { d: 'M36 50 Q50 40 64 50', fill: 'none', stroke: '#E53935', 'stroke-width': 4 }),
    s('rect', { x: 36, y: 8, width: 28, height: 8, rx: 3, fill: '#B0BEC5', ...o, 'stroke-width': 3 }),
  ],
};

export type RoutineArt = keyof typeof DRAW;
export const routineArt = (id: string): SVGSVGElement => svgRoot('0 0 100 100', (DRAW[id] ?? DRAW.permen)());
export const ROUTINE_ART_IDS = Object.keys(DRAW);
