import { draw as gardenDraw, type Kind } from './garden-items';
import { s } from './svg';
import { thing, type ArtId } from './things';

/** All theme drawings are anchored at bottom-centre (0,0), like the garden items. */
const o = { stroke: '#4A3B3B', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' } as const;

/** One of the 100×100 object drawings, `size` tall, standing on (0,0). */
export function thingAt(id: ArtId, size = 60): SVGGElement {
  const svg = thing(id);
  svg.setAttribute('x', String(-size / 2));
  svg.setAttribute('y', String(-size));
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  return s('g', {}, [svg]);
}

export const garden = (k: Kind, color = '#E53935') => gardenDraw(k, color);

export const ART = {
  // —— Kebun Buah ——
  semangka: () => s('g', {}, [
    s('path', { d: 'M-34 0 A34 34 0 0 1 34 0 Z', fill: '#43A047', ...o }),
    s('path', { d: 'M-28 0 A28 28 0 0 1 28 0 Z', fill: '#E53935' }),
    ...[[-14, -8], [0, -14], [14, -8]].map(([x, y]) => s('ellipse', { cx: x, cy: y, rx: 2, ry: 3.5, fill: '#4A3B3B' })),
  ]),
  labu: () => s('g', {}, [
    s('ellipse', { cx: -12, cy: -18, rx: 16, ry: 18, fill: '#FB8C00', ...o }),
    s('ellipse', { cx: 12, cy: -18, rx: 16, ry: 18, fill: '#FB8C00', ...o }),
    s('ellipse', { cx: 0, cy: -18, rx: 14, ry: 19, fill: '#FFA726', ...o }),
    s('path', { d: 'M0 -36 q2 -10 8 -12', fill: 'none', stroke: '#558B2F', 'stroke-width': 5 }),
  ]),
  keranjang: () => s('g', {}, [
    s('circle', { cx: -12, cy: -34, r: 10, fill: '#E53935', ...o }), s('circle', { cx: 6, cy: -38, r: 10, fill: '#FFA94D', ...o }), s('circle', { cx: 18, cy: -30, r: 9, fill: '#C0CA33', ...o }),
    s('path', { d: 'M-30 -28 H30 L24 0 H-24 Z', fill: '#C98B5A', ...o }),
    s('path', { d: 'M-26 -18 H26 M-25 -8 H25', stroke: '#A0673D', 'stroke-width': 3 }),
  ]),
  // —— Taman Laut ——
  karang: (c = '#FF7043') => s('g', {}, [
    s('path', { d: 'M0 0 V-30 M0 -30 L-14 -48 M0 -30 L12 -50 M-14 -48 L-20 -62 M-14 -48 L-6 -64 M12 -50 L20 -64 M0 -16 L-16 -26 M0 -20 L16 -30', fill: 'none', stroke: c, 'stroke-width': 9, 'stroke-linecap': 'round' }),
  ]),
  rumput_laut: () => s('g', {}, [
    s('path', { d: 'M-8 0 Q-20 -24 -6 -40 Q8 -56 -4 -76', fill: 'none', stroke: '#43A047', 'stroke-width': 8, 'stroke-linecap': 'round' }),
    s('path', { d: 'M8 0 Q20 -20 8 -36 Q-2 -50 10 -62', fill: 'none', stroke: '#66BB6A', 'stroke-width': 7, 'stroke-linecap': 'round' }),
  ]),
  ikan_warna: (c = '#FDD835') => s('g', { class: 'float' }, [
    s('path', { d: 'M18 -14 L32 -24 L32 -4 Z', fill: c, ...o }),
    s('ellipse', { cx: 0, cy: -14, rx: 20, ry: 13, fill: c, ...o }),
    s('circle', { cx: -9, cy: -17, r: 2.5, fill: '#4A3B3B' }),
    s('path', { d: 'M2 -24 q4 10 0 20', fill: 'none', stroke: '#fff', 'stroke-width': 3, opacity: 0.6 }),
  ]),
  penyu: () => s('g', {}, [
    s('ellipse', { cx: -28, cy: -14, rx: 9, ry: 7, fill: '#81C784', ...o }),
    s('path', { d: 'M-18 -6 l-10 8 M18 -6 l10 8 M-14 -20 l-12 -6 M14 -20 l12 -6', stroke: '#81C784', 'stroke-width': 7, 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 0, cy: -14, rx: 22, ry: 15, fill: '#558B2F', ...o }),
    s('path', { d: 'M-10 -22 l10 -6 l10 6 l-4 12 h-12 z', fill: '#7CB342' }),
    s('circle', { cx: -31, cy: -16, r: 1.8, fill: '#4A3B3B' }),
  ]),
  kerang: () => s('g', {}, [
    s('path', { d: 'M0 0 L-22 -10 Q-22 -34 0 -38 Q22 -34 22 -10 Z', fill: '#F8BBD0', ...o }),
    s('path', { d: 'M0 0 L-12 -34 M0 0 L0 -38 M0 0 L12 -34', stroke: '#EC407A', 'stroke-width': 2 }),
  ]),
  kepiting: () => s('g', {}, [
    s('path', { d: 'M-20 -10 l-12 6 M-18 -4 l-12 10 M20 -10 l12 6 M18 -4 l12 10', stroke: '#E53935', 'stroke-width': 4, 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 0, cy: -12, rx: 20, ry: 12, fill: '#EF5350', ...o }),
    s('path', { d: 'M-14 -20 l-10 -14 M14 -20 l10 -14', stroke: '#EF5350', 'stroke-width': 5 }),
    s('circle', { cx: -26, cy: -36, r: 6, fill: '#EF5350', ...o, 'stroke-width': 2 }), s('circle', { cx: 26, cy: -36, r: 6, fill: '#EF5350', ...o, 'stroke-width': 2 }),
    s('circle', { cx: -6, cy: -18, r: 2.5, fill: '#4A3B3B' }), s('circle', { cx: 6, cy: -18, r: 2.5, fill: '#4A3B3B' }),
  ]),
  gurita: () => s('g', {}, [
    ...[-18, -9, 0, 9, 18].map((x) => s('path', { d: `M${x} -16 q${x / 3} 10 ${x / 2 + 4} 16`, fill: 'none', stroke: '#AB47BC', 'stroke-width': 6, 'stroke-linecap': 'round' })),
    s('ellipse', { cx: 0, cy: -30, rx: 20, ry: 20, fill: '#BA68C8', ...o }),
    s('circle', { cx: -7, cy: -32, r: 3, fill: '#4A3B3B' }), s('circle', { cx: 7, cy: -32, r: 3, fill: '#4A3B3B' }),
  ]),
  ubur: () => s('g', { class: 'float' }, [
    s('path', { d: 'M-18 -10 Q-18 -34 0 -34 Q18 -34 18 -10 Z', fill: '#CE93D8', opacity: 0.9, ...o, 'stroke-width': 2 }),
    s('path', { d: 'M-10 -10 q-4 10 0 18 M0 -10 q4 10 0 20 M10 -10 q-4 10 0 18', fill: 'none', stroke: '#CE93D8', 'stroke-width': 3 }),
  ]),
  gelembung: () => s('g', { class: 'float' }, [
    s('circle', { cx: 0, cy: -10, r: 8, fill: '#E1F5FE', opacity: 0.8, stroke: '#fff', 'stroke-width': 2 }),
    s('circle', { cx: 12, cy: -28, r: 5, fill: '#E1F5FE', opacity: 0.8, stroke: '#fff', 'stroke-width': 2 }),
    s('circle', { cx: -6, cy: -38, r: 4, fill: '#E1F5FE', opacity: 0.8, stroke: '#fff', 'stroke-width': 2 }),
  ]),
  // —— Hutan Ajaib ——
  cemara: () => s('g', {}, [
    s('rect', { x: -6, y: -16, width: 12, height: 16, fill: '#6D4C41', ...o }),
    s('path', { d: 'M0 -100 L-26 -60 H-14 L-34 -30 H-20 L-40 -14 H40 L20 -30 H34 L14 -60 H26 Z', fill: '#2E7D32', ...o }),
  ]),
  burung_hantu: () => s('g', {}, [
    s('ellipse', { cx: 0, cy: -22, rx: 18, ry: 22, fill: '#8D6E63', ...o }),
    s('ellipse', { cx: 0, cy: -16, rx: 11, ry: 13, fill: '#D7CCC8' }),
    s('circle', { cx: -7, cy: -32, r: 7, fill: '#fff', ...o, 'stroke-width': 2 }), s('circle', { cx: 7, cy: -32, r: 7, fill: '#fff', ...o, 'stroke-width': 2 }),
    s('circle', { cx: -7, cy: -32, r: 3, fill: '#4A3B3B' }), s('circle', { cx: 7, cy: -32, r: 3, fill: '#4A3B3B' }),
    s('path', { d: 'M-3 -24 L0 -20 L3 -24 Z', fill: '#FFA94D' }),
    s('path', { d: 'M-16 -40 L-12 -50 L-6 -42 M16 -40 L12 -50 L6 -42', fill: '#8D6E63', ...o, 'stroke-width': 2 }),
  ]),
  rusa: () => s('g', {}, [
    s('ellipse', { cx: 0, cy: -30, rx: 24, ry: 13, fill: '#A1887F', ...o }),
    s('path', { d: 'M-16 -20 V0 M-6 -20 V0 M8 -20 V0 M18 -20 V0', stroke: '#8D6E63', 'stroke-width': 5, 'stroke-linecap': 'round' }),
    s('path', { d: 'M18 -36 L26 -56', stroke: '#A1887F', 'stroke-width': 9, 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 30, cy: -60, rx: 9, ry: 7, fill: '#A1887F', ...o }),
    s('path', { d: 'M26 -66 l-6 -12 l-6 4 M26 -66 l-6 -12 l2 -6 M34 -66 l6 -12 l6 4 M34 -66 l6 -12 l-2 -6', fill: 'none', stroke: '#6D4C41', 'stroke-width': 3 }),
    s('circle', { cx: 33, cy: -61, r: 1.8, fill: '#4A3B3B' }),
    ...[[-8, -32], [4, -34], [-14, -28]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 2.5, fill: '#fff' })),
  ]),
  kunang: () => s('g', { class: 'float' }, [
    s('circle', { cx: 0, cy: -10, r: 9, fill: '#FFF59D', opacity: 0.35 }),
    s('circle', { cx: 0, cy: -10, r: 3.5, fill: '#FFEB3B' }),
    s('circle', { cx: 22, cy: -26, r: 7, fill: '#FFF59D', opacity: 0.35 }),
    s('circle', { cx: 22, cy: -26, r: 3, fill: '#FFEB3B' }),
  ]),
  pakis: () => s('g', {}, [-50, -25, 0, 25, 50].map((a) => s('path', { d: 'M0 0 Q4 -24 0 -44', fill: 'none', stroke: '#388E3C', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '6 3', transform: `rotate(${a})` }))),
};

/** Decorations for the new themes (bottom-centre anchored). */
export const DECOR_ART = {
  pagar_bambu: () => s('g', {}, [s('path', { d: 'M-34 -20 H34', stroke: '#C0CA33', 'stroke-width': 5 }), ...[-28, -10, 8, 26].map((x) => s('rect', { x: x - 4, y: -40, width: 8, height: 40, rx: 3, fill: '#D4E157', ...o, 'stroke-width': 2 }))]),
  kotak_harta: () => s('g', {}, [
    s('rect', { x: -26, y: -26, width: 52, height: 26, fill: '#A0673D', ...o }),
    s('path', { d: 'M-26 -26 Q0 -46 26 -26 Z', fill: '#8D5A33', ...o }),
    s('rect', { x: -5, y: -30, width: 10, height: 12, fill: '#FDD835', ...o, 'stroke-width': 2 }),
    s('circle', { cx: -14, cy: -32, r: 4, fill: '#FDD835' }), s('circle', { cx: 16, cy: -34, r: 4, fill: '#FDD835' }),
  ]),
  jangkar: () => s('g', {}, [
    s('path', { d: 'M0 -60 V-6 M-22 -22 Q-20 0 0 -6 Q20 0 22 -22 M-10 -48 H10', fill: 'none', stroke: '#78909C', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    s('circle', { cx: 0, cy: -64, r: 6, fill: 'none', stroke: '#78909C', 'stroke-width': 4 }),
  ]),
  kapal_karam: () => s('g', {}, [
    s('path', { d: 'M-50 -6 L-40 -34 H40 L56 -14 Z', fill: '#8D6E63', ...o, transform: 'rotate(-8)' }),
    s('path', { d: 'M-4 -34 V-80 L26 -60 Z', fill: '#ECEFF1', opacity: 0.8, ...o, 'stroke-width': 2, transform: 'rotate(-8)' }),
  ]),
  istana_pasir: () => s('g', {}, [
    s('rect', { x: -30, y: -26, width: 60, height: 26, fill: '#FFE082', ...o }),
    s('rect', { x: -26, y: -46, width: 16, height: 20, fill: '#FFE082', ...o }), s('rect', { x: 10, y: -46, width: 16, height: 20, fill: '#FFE082', ...o }),
    s('path', { d: 'M-26 -46 L-18 -58 L-10 -46 M10 -46 L18 -58 L26 -46', fill: '#FFD54F', ...o, 'stroke-width': 2 }),
    s('path', { d: 'M18 -58 V-70 L28 -66 L18 -62', fill: '#E53935', stroke: '#4A3B3B', 'stroke-width': 1.5 }),
  ]),
  batu_laut: () => s('ellipse', { cx: 0, cy: -8, rx: 22, ry: 11, fill: '#90A4AE', ...o, 'stroke-width': 2 }),
  rumah_pohon: () => s('g', {}, [
    s('rect', { x: -10, y: -70, width: 20, height: 70, fill: '#6D4C41', ...o }),
    s('rect', { x: -34, y: -100, width: 68, height: 36, fill: '#A1887F', ...o }),
    s('path', { d: 'M-42 -98 L0 -126 L42 -98 Z', fill: '#E57373', ...o }),
    s('rect', { x: -8, y: -94, width: 16, height: 18, fill: '#FFF59D', ...o, 'stroke-width': 2 }),
    s('path', { d: 'M24 -64 V0 M34 -64 V0 M24 -50 H34 M24 -34 H34 M24 -18 H34', stroke: '#8D6E63', 'stroke-width': 3 }),
  ]),
  lentera: () => s('g', {}, [
    s('path', { d: 'M0 0 V-50', stroke: '#4A3B3B', 'stroke-width': 4 }),
    s('circle', { cx: 0, cy: -60, r: 16, fill: '#FFF59D', opacity: 0.35 }),
    s('rect', { x: -8, y: -68, width: 16, height: 18, rx: 4, fill: '#FFEB3B', ...o, 'stroke-width': 2 }),
  ]),
  jembatan: () => s('g', {}, [
    s('path', { d: 'M-50 0 Q0 -30 50 0', fill: 'none', stroke: '#8D6E63', 'stroke-width': 8 }),
    s('path', { d: 'M-50 -16 Q0 -46 50 -16', fill: 'none', stroke: '#A1887F', 'stroke-width': 3 }),
    ...[-36, -18, 0, 18, 36].map((x) => s('path', { d: `M${x} ${-Math.abs(x) * 0.4 - 4} V${-Math.abs(x) * 0.4 - 24}`, stroke: '#A1887F', 'stroke-width': 3 })),
  ]),
  pintu_peri: () => s('g', {}, [
    s('path', { d: 'M-14 0 V-24 Q0 -40 14 -24 V0 Z', fill: '#AB47BC', ...o }),
    s('circle', { cx: 7, cy: -12, r: 2.5, fill: '#FDD835' }),
    s('path', { d: 'M-20 0 H20', stroke: '#6D4C41', 'stroke-width': 4 }),
  ]),
};
export type DecorArt = keyof typeof DECOR_ART;
