import { COUNT_OBJECTS, type CountObject } from '../content/lines';
import { countObject } from './objects';
import { monyet } from './monyet';
import { s, svgRoot } from './svg';

const o = { stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' } as const;
const eye = (x: number, y: number, r = 3.5) => s('circle', { cx: x, cy: y, r, fill: '#4A3B3B' });

const DRAW = {
  ular: () => [
    s('path', { d: 'M14 74 Q14 56 32 58 Q50 60 50 46 Q50 30 66 30 Q84 30 84 44', fill: 'none', stroke: '#43A047', 'stroke-width': 16, 'stroke-linecap': 'round' }),
    s('path', { d: 'M14 74 Q14 56 32 58 Q50 60 50 46 Q50 30 66 30 Q84 30 84 44', fill: 'none', stroke: '#81C784', 'stroke-width': 6, 'stroke-dasharray': '4 10', 'stroke-linecap': 'round' }),
    s('circle', { cx: 84, cy: 46, r: 11, fill: '#43A047', ...o }), eye(87, 43, 2.5),
    s('path', { d: 'M90 54 l4 6 m-4 -6 l-2 7', stroke: '#E53935', 'stroke-width': 2.5, fill: 'none' }),
  ],
  ember: () => [
    s('path', { d: 'M22 36 H78 L70 88 H30 Z', fill: '#1E88E5', ...o }),
    s('ellipse', { cx: 50, cy: 36, rx: 28, ry: 8, fill: '#64B5F6', ...o }),
    s('path', { d: 'M22 36 Q50 0 78 36', fill: 'none', ...o }),
  ],
  ombak: () => [
    s('path', { d: 'M6 70 Q20 30 44 40 Q60 48 52 60 Q44 66 40 58 Q60 50 72 62 Q84 74 94 66 V92 H6 Z', fill: '#4FC3F7', ...o }),
    s('path', { d: 'M6 82 Q26 74 46 82 T94 80', fill: 'none', stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' }),
  ],
  mobil: () => [
    s('path', { d: 'M8 64 Q8 48 22 46 L30 30 H66 L76 46 Q92 48 92 64 V72 H8 Z', fill: '#E53935', ...o }),
    s('path', { d: 'M34 34 H48 V46 H28 Z M52 34 H64 L71 46 H52 Z', fill: '#BBDEFB', ...o, 'stroke-width': 3 }),
    s('circle', { cx: 28, cy: 74, r: 10, fill: '#4A3B3B' }), s('circle', { cx: 72, cy: 74, r: 10, fill: '#4A3B3B' }),
    s('circle', { cx: 28, cy: 74, r: 4, fill: '#ddd' }), s('circle', { cx: 72, cy: 74, r: 4, fill: '#ddd' }),
  ],
  pisang: () => [
    s('path', { d: 'M18 30 Q22 78 74 80 Q86 80 84 72 Q46 70 34 28 Z', fill: '#FDD835', ...o }),
    s('path', { d: 'M18 30 l-4 -8 l8 2 z', fill: '#6D4C41', ...o, 'stroke-width': 2 }),
  ],
  susu: () => [
    s('path', { d: 'M30 30 L50 14 L70 30 V88 H30 Z', fill: '#fff', ...o }),
    s('path', { d: 'M30 30 H70', ...o }),
    s('rect', { x: 36, y: 46, width: 28, height: 26, rx: 6, fill: '#64B5F6' }),
    s('path', { d: 'M40 64 q10 -14 20 0', fill: '#fff' }),
  ],
  topi: () => [
    s('path', { d: 'M24 64 Q24 26 50 26 Q76 26 76 64 Z', fill: '#FFA94D', ...o }),
    s('path', { d: 'M14 66 Q50 58 92 66 Q92 76 50 74 Q14 76 14 66 Z', fill: '#FF8A65', ...o }),
    s('rect', { x: 26, y: 52, width: 48, height: 8, fill: '#E53935' }),
  ],
  kucing: () => [
    s('path', { d: 'M24 40 L28 14 L44 30 Z M76 40 L72 14 L56 30 Z', fill: '#FFB74D', ...o }),
    s('circle', { cx: 50, cy: 52, r: 30, fill: '#FFB74D', ...o }),
    eye(40, 48), eye(60, 48),
    s('path', { d: 'M46 58 h8 l-4 4 z', fill: '#FF7FA3' }),
    s('path', { d: 'M50 62 q-6 6 -10 2 M50 62 q6 6 10 2 M22 56 h12 M66 56 h12 M24 64 l10 -3 M76 64 l-10 -3', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 2.5, 'stroke-linecap': 'round' }),
  ],
  nanas: () => [
    s('path', { d: 'M50 30 L40 8 L50 18 L56 4 L58 20 L70 10 L60 30 Z', fill: '#43A047', ...o, 'stroke-width': 3 }),
    s('ellipse', { cx: 50, cy: 62, rx: 24, ry: 30, fill: '#FDD835', ...o }),
    s('path', { d: 'M32 48 L66 82 M30 66 L54 90 M44 34 L72 62 M68 44 L34 80 M72 64 L50 88 M56 34 L28 62', stroke: '#E0A800', 'stroke-width': 2.5 }),
  ],
  lampu: () => [
    s('path', { d: 'M50 12 C28 12 22 36 34 52 Q40 60 40 68 H60 Q60 60 66 52 C78 36 72 12 50 12 Z', fill: '#FFF176', ...o }),
    s('rect', { x: 40, y: 68, width: 20, height: 16, rx: 3, fill: '#B0BEC5', ...o }),
    s('path', { d: 'M44 88 h12', ...o }),
    s('path', { d: 'M12 30 l8 3 M88 30 l-8 3 M50 2 v4', ...o, stroke: '#FFB300' }),
  ],
  daun: () => [
    s('path', { d: 'M18 82 Q14 20 84 16 Q86 78 18 82 Z', fill: '#43A047', ...o }),
    s('path', { d: 'M18 82 Q50 52 74 26 M40 62 l-6 -14 M54 48 l-4 -14 M48 56 l14 2', fill: 'none', stroke: '#2E7D32', 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ],
  donat: () => [
    s('circle', { cx: 50, cy: 50, r: 36, fill: '#D7A36B', ...o }),
    s('path', { d: 'M18 46 Q22 18 50 16 Q80 18 82 46 Q76 40 70 46 Q62 38 56 46 Q48 38 42 46 Q34 40 28 46 Q22 40 18 46 Z', fill: '#FF8FB1' }),
    s('circle', { cx: 50, cy: 50, r: 11, fill: '#FFF8E7', ...o }),
    s('path', { d: 'M30 30 l4 2 M64 26 l3 4 M44 22 l-2 4 M72 40 l4 1', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ],
  roda: () => [
    s('circle', { cx: 50, cy: 50, r: 38, fill: '#4A3B3B' }),
    s('circle', { cx: 50, cy: 50, r: 22, fill: '#B0BEC5', ...o }),
    s('circle', { cx: 50, cy: 50, r: 6, fill: '#4A3B3B' }),
  ],
  pizza: () => [
    s('path', { d: 'M50 88 L14 18 Q50 6 86 18 Z', fill: '#FFCC80', ...o }),
    s('path', { d: 'M14 18 Q50 6 86 18 L82 26 Q50 14 18 26 Z', fill: '#D7A36B', ...o, 'stroke-width': 3 }),
    s('circle', { cx: 40, cy: 36, r: 6, fill: '#E53935' }), s('circle', { cx: 58, cy: 40, r: 6, fill: '#E53935' }), s('circle', { cx: 50, cy: 58, r: 5, fill: '#E53935' }),
  ],
  'topi-pesta': () => [
    s('path', { d: 'M50 10 L80 86 H20 Z', fill: '#AB47BC', ...o }),
    s('path', { d: 'M34 50 L66 50 M28 68 L72 68', stroke: '#FDD835', 'stroke-width': 6 }),
    s('circle', { cx: 50, cy: 10, r: 7, fill: '#FDD835', ...o, 'stroke-width': 3 }),
  ],
  kado: () => [
    s('rect', { x: 16, y: 36, width: 68, height: 52, rx: 4, fill: '#E53935', ...o }),
    s('rect', { x: 12, y: 28, width: 76, height: 14, rx: 3, fill: '#EF5350', ...o }),
    s('rect', { x: 44, y: 28, width: 12, height: 60, fill: '#FDD835' }),
    s('path', { d: 'M50 28 Q30 6 30 22 Q30 28 50 28 Q70 28 70 22 Q70 6 50 28 Z', fill: '#FDD835', ...o, 'stroke-width': 3 }),
  ],
  jendela: () => [
    s('rect', { x: 16, y: 16, width: 68, height: 68, rx: 4, fill: '#BBDEFB', ...o }),
    s('path', { d: 'M50 16 V84 M16 50 H84', ...o, 'stroke-width': 6, stroke: '#A0673D' }),
    s('rect', { x: 16, y: 16, width: 68, height: 68, rx: 4, fill: 'none', ...o, 'stroke-width': 6, stroke: '#A0673D' }),
  ],
  bata: () => [
    s('rect', { x: 8, y: 32, width: 84, height: 40, rx: 4, fill: '#E57350', ...o }),
    s('path', { d: 'M8 52 H92 M36 32 V52 M64 52 V72', stroke: '#B5452A', 'stroke-width': 3 }),
  ],
  pintu: () => [
    s('rect', { x: 28, y: 8, width: 44, height: 86, rx: 4, fill: '#A0673D', ...o }),
    s('rect', { x: 36, y: 18, width: 28, height: 26, rx: 3, fill: '#8D5A33' }),
    s('rect', { x: 36, y: 52, width: 28, height: 32, rx: 3, fill: '#8D5A33' }),
    s('circle', { cx: 64, cy: 50, r: 4, fill: '#FDD835' }),
  ],
  'bintang-laut': () => [
    s('path', { d: 'M50 8 Q56 30 62 36 Q84 34 92 40 Q74 52 70 60 Q78 82 74 90 Q58 76 50 74 Q42 76 26 90 Q22 82 30 60 Q26 52 8 40 Q16 34 38 36 Q44 30 50 8 Z', fill: '#FF8A65', ...o }),
    eye(43, 48), eye(57, 48),
    s('path', { d: 'M44 58 q6 6 12 0', fill: 'none', ...o, 'stroke-width': 3 }),
  ],
  'kue-hati': () => [
    s('path', { d: 'M50 86 C10 58 12 22 34 20 Q46 20 50 32 Q54 20 66 20 C88 22 90 58 50 86 Z', fill: '#D7A36B', ...o }),
    s('path', { d: 'M50 74 C24 54 26 32 38 31 Q46 31 50 42 Q54 31 62 31 C74 32 76 54 50 74 Z', fill: '#FF8FB1' }),
  ],
  'balon-hati': () => [
    s('path', { d: 'M50 70 C14 48 16 14 36 12 Q46 12 50 24 Q54 12 64 12 C84 14 86 48 50 70 Z', fill: '#E53935', ...o }),
    s('path', { d: 'M50 70 Q44 82 52 94', fill: 'none', ...o, 'stroke-width': 2.5 }),
    s('ellipse', { cx: 34, cy: 28, rx: 5, ry: 8, fill: '#fff', opacity: 0.5 }),
  ],
  stroberi: () => [
    s('path', { d: 'M20 34 Q50 22 80 34 Q80 70 50 90 Q20 70 20 34 Z', fill: '#E53935', ...o }),
    s('path', { d: 'M30 30 L40 16 L50 26 L60 16 L70 30 Z', fill: '#43A047', ...o, 'stroke-width': 3 }),
    ...[[36, 46], [52, 44], [64, 52], [42, 62], [56, 66], [48, 78]].map(([x, y]) => s('ellipse', { cx: x, cy: y, rx: 2, ry: 3, fill: '#FDD835' })),
  ],
  tomat: () => [
    s('circle', { cx: 50, cy: 56, r: 34, fill: '#E53935', ...o }),
    s('path', { d: 'M50 26 L40 18 L46 28 L34 30 L48 32 L50 40 L54 32 L66 30 L56 28 L60 18 Z', fill: '#43A047', ...o, 'stroke-width': 2.5 }),
    s('ellipse', { cx: 36, cy: 50, rx: 6, ry: 9, fill: '#fff', opacity: 0.4 }),
  ],
  balon: () => [
    s('ellipse', { cx: 50, cy: 40, rx: 28, ry: 32, fill: '#1E88E5', ...o }),
    s('path', { d: 'M46 72 h8 l-4 6 z', fill: '#1E88E5', ...o, 'stroke-width': 2.5 }),
    s('path', { d: 'M50 78 Q44 86 52 96', fill: 'none', ...o, 'stroke-width': 2.5 }),
    s('ellipse', { cx: 38, cy: 28, rx: 5, ry: 9, fill: '#fff', opacity: 0.5 }),
  ],
  katak: () => [
    s('ellipse', { cx: 50, cy: 62, rx: 36, ry: 26, fill: '#43A047', ...o }),
    s('circle', { cx: 32, cy: 36, r: 12, fill: '#fff', ...o }), s('circle', { cx: 68, cy: 36, r: 12, fill: '#fff', ...o }),
    eye(32, 36, 5), eye(68, 36, 5),
    s('path', { d: 'M34 66 q16 12 32 0', fill: 'none', ...o, 'stroke-width': 3 }),
  ],
  brokoli: () => [
    s('path', { d: 'M42 90 L44 56 H56 L58 90 Z', fill: '#AED581', ...o }),
    s('circle', { cx: 32, cy: 44, r: 16, fill: '#43A047', ...o }), s('circle', { cx: 68, cy: 44, r: 16, fill: '#43A047', ...o }),
    s('circle', { cx: 50, cy: 30, r: 20, fill: '#43A047', ...o }),
  ],
  wortel: () => [
    s('path', { d: 'M30 30 Q50 22 70 30 L52 94 Q50 98 48 94 Z', fill: '#FFA94D', ...o }),
    s('path', { d: 'M50 26 L40 4 M50 26 L50 2 M50 26 L62 6', stroke: '#43A047', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    s('path', { d: 'M38 46 h8 M52 60 h8 M42 74 h6', stroke: '#E07B1F', 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ],
  gajah: () => [
    s('ellipse', { cx: 54, cy: 60, rx: 32, ry: 24, fill: '#90A4AE', ...o }),
    s('path', { d: 'M28 50 Q10 56 12 80 Q12 88 18 86 Q22 70 30 66', fill: '#90A4AE', ...o }),
    s('ellipse', { cx: 40, cy: 48, rx: 14, ry: 18, fill: '#B0BEC5', ...o }),
    s('rect', { x: 40, y: 76, width: 12, height: 16, fill: '#90A4AE', ...o, 'stroke-width': 3 }),
    s('rect', { x: 66, y: 76, width: 12, height: 16, fill: '#90A4AE', ...o, 'stroke-width': 3 }),
    eye(28, 46, 3),
  ],
  roti: () => [
    s('path', { d: 'M16 50 Q12 22 50 22 Q88 22 84 50 V82 Q84 88 78 88 H22 Q16 88 16 82 Z', fill: '#E0A96D', ...o }),
    s('path', { d: 'M24 52 Q22 32 50 32 Q78 32 76 52 V80 H24 Z', fill: '#FFE0B2' }),
  ],
  hati: () => [
    s('path', { d: 'M50 88 C8 60 10 18 32 16 Q46 16 50 30 Q54 16 68 16 C90 18 92 60 50 88 Z', fill: '#E53935', ...o }),
    s('ellipse', { cx: 32, cy: 32, rx: 6, ry: 9, fill: '#fff', opacity: 0.5 }),
  ],
  jeruk: () => [
    s('circle', { cx: 50, cy: 56, r: 34, fill: '#FFA94D', ...o }),
    s('ellipse', { cx: 60, cy: 18, rx: 12, ry: 6, fill: '#43A047', transform: 'rotate(-20 60 18)', ...o, 'stroke-width': 3 }),
    ...[[38, 46], [58, 40], [46, 66], [66, 62]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 2, fill: '#E07B1F' })),
  ],
  cicak: () => [
    s('path', { d: 'M50 14 Q62 14 60 30 L58 66 Q56 80 70 90', fill: 'none', stroke: '#A5D6A7', 'stroke-width': 14, 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 52, cy: 46, rx: 10, ry: 24, fill: '#A5D6A7', ...o }),
    s('ellipse', { cx: 52, cy: 16, rx: 10, ry: 12, fill: '#A5D6A7', ...o }),
    s('path', { d: 'M42 36 L26 26 M62 36 L78 26 M44 60 L28 72 M60 60 L76 72', ...o, 'stroke-width': 5 }),
    eye(47, 12, 2.5), eye(57, 12, 2.5),
  ],
  yoyo: () => [
    s('circle', { cx: 50, cy: 62, r: 30, fill: '#AB47BC', ...o }),
    s('circle', { cx: 50, cy: 62, r: 12, fill: '#FDD835', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M50 50 V6', ...o, 'stroke-width': 2.5 }),
    s('circle', { cx: 50, cy: 6, r: 4, fill: '#4A3B3B' }),
  ],
  foto: () => [
    s('rect', { x: 10, y: 30, width: 80, height: 56, rx: 8, fill: '#546E7A', ...o }),
    s('rect', { x: 30, y: 20, width: 24, height: 14, rx: 3, fill: '#546E7A', ...o, 'stroke-width': 3 }),
    s('circle', { cx: 50, cy: 58, r: 18, fill: '#90CAF9', ...o }),
    s('circle', { cx: 50, cy: 58, r: 8, fill: '#1E88E5' }),
    s('circle', { cx: 78, cy: 40, r: 4, fill: '#FDD835' }),
  ],
  zebra: () => [
    s('ellipse', { cx: 56, cy: 54, rx: 30, ry: 20, fill: '#fff', ...o }),
    s('path', { d: 'M30 46 Q18 30 22 16 Q34 14 38 34', fill: '#fff', ...o }),
    s('path', { d: 'M44 38 V70 M56 34 V74 M68 36 V72 M24 24 H34 M22 32 H36', stroke: '#4A3B3B', 'stroke-width': 5 }),
    s('path', { d: 'M38 70 V90 M50 72 V90 M66 72 V90 M78 68 V88', ...o, 'stroke-width': 6, 'stroke-linecap': 'round' }),
    eye(28, 22, 2.5),
  ],
  vas: () => [
    s('path', { d: 'M36 40 Q20 60 30 86 H70 Q80 60 64 40 Q60 34 64 28 H36 Q40 34 36 40 Z', fill: '#4FC3F7', ...o }),
    s('path', { d: 'M44 28 Q40 10 30 8 M56 28 Q62 12 70 10 M50 28 V6', stroke: '#43A047', 'stroke-width': 4, fill: 'none' }),
    s('circle', { cx: 30, cy: 8, r: 6, fill: '#E53935' }), s('circle', { cx: 70, cy: 10, r: 6, fill: '#FDD835' }), s('circle', { cx: 50, cy: 6, r: 6, fill: '#FF8FB1' }),
  ],
  xilofon: () => [
    ...['#E53935', '#FFA94D', '#FDD835', '#43A047', '#1E88E5'].map((c, i) =>
      s('rect', { x: 12 + i * 16, y: 24 + i * 6, width: 12, height: 64 - i * 12, rx: 3, fill: c, ...o, 'stroke-width': 3 }),
    ),
    s('path', { d: 'M70 20 L90 6 M88 4 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0', ...o, 'stroke-width': 3, fill: '#A0673D' }),
  ],
  ayam: () => [
    s('ellipse', { cx: 50, cy: 62, rx: 30, ry: 24, fill: '#fff', ...o }),
    s('circle', { cx: 70, cy: 36, r: 14, fill: '#fff', ...o }),
    s('path', { d: 'M64 22 Q66 12 72 18 Q76 10 80 20 Q78 26 72 24 Z', fill: '#E53935', ...o, 'stroke-width': 2.5 }),
    s('path', { d: 'M84 36 l10 3 l-10 4 z', fill: '#FFA94D', ...o, 'stroke-width': 2.5 }),
    s('path', { d: 'M76 46 q4 8 -2 10', fill: '#E53935' }),
    s('path', { d: 'M20 56 Q8 44 14 34 Q24 44 28 50', fill: '#fff', ...o }),
    s('path', { d: 'M44 86 v8 M58 86 v8', ...o, stroke: '#FFA94D' }),
    eye(73, 33, 3),
  ],
  anggur: () => [
    s('path', { d: 'M50 18 Q54 6 64 8', fill: 'none', ...o, stroke: '#6D4C41' }),
    s('path', { d: 'M54 14 Q72 6 76 20 Q62 24 54 14 Z', fill: '#43A047', ...o, 'stroke-width': 3 }),
    ...[[38, 30], [54, 30], [70, 32], [44, 46], [60, 46], [36, 60], [52, 62], [68, 58], [44, 76], [60, 76], [52, 90]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 9, fill: '#8E24AA', ...o, 'stroke-width': 2.5 })),
  ],
  udang: () => [
    s('path', { d: 'M80 40 Q78 14 50 16 Q20 18 18 46 Q18 70 40 74 Q56 76 58 62 Q60 50 46 50', fill: 'none', stroke: '#FF8A65', 'stroke-width': 18, 'stroke-linecap': 'round' }),
    s('path', { d: 'M46 50 L32 40 L34 58 Z', fill: '#FF7043', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M80 40 L92 30 M80 40 L94 44', ...o, 'stroke-width': 2.5 }),
    s('path', { d: 'M44 18 v14 M30 26 l8 10 M22 42 h12', stroke: '#E64A19', 'stroke-width': 3 }),
    eye(78, 34, 3),
  ],
  'es-krim': () => [
    s('path', { d: 'M32 50 L50 94 L68 50 Z', fill: '#E0A96D', ...o }),
    s('path', { d: 'M38 58 L60 58 M42 68 L58 68', stroke: '#B5793E', 'stroke-width': 2.5 }),
    s('circle', { cx: 40, cy: 42, r: 14, fill: '#FF8FB1', ...o }),
    s('circle', { cx: 60, cy: 42, r: 14, fill: '#FFF59D', ...o }),
    s('circle', { cx: 50, cy: 26, r: 14, fill: '#8D6E63', ...o }),
    s('circle', { cx: 50, cy: 10, r: 5, fill: '#E53935', ...o, 'stroke-width': 2 }),
  ],
  obeng: () => [
    s('rect', { x: 18, y: 14, width: 26, height: 44, rx: 10, fill: '#E53935', ...o, transform: 'rotate(-40 31 36)' }),
    s('path', { d: 'M44 50 L82 84', stroke: '#90A4AE', 'stroke-width': 8, 'stroke-linecap': 'round' }),
    s('path', { d: 'M78 80 L88 90', stroke: '#546E7A', 'stroke-width': 10 }),
  ],
  mangga: () => [
    s('path', { d: 'M30 30 Q60 6 82 36 Q96 70 64 88 Q30 98 20 70 Q14 46 30 30 Z', fill: '#FFB300', ...o }),
    s('path', { d: 'M30 30 Q40 50 64 88', fill: 'none', stroke: '#FFA000', 'stroke-width': 3 }),
    s('ellipse', { cx: 70, cy: 20, rx: 14, ry: 6, fill: '#43A047', transform: 'rotate(-30 70 20)', ...o, 'stroke-width': 3 }),
  ],
  buku: () => [
    s('path', { d: 'M50 24 Q30 14 10 20 V82 Q30 76 50 86 Q70 76 90 82 V20 Q70 14 50 24 Z', fill: '#fff', ...o }),
    s('path', { d: 'M50 24 V86', ...o }),
    s('path', { d: 'M18 34 Q30 30 42 36 M18 46 Q30 42 42 48 M58 36 Q70 30 82 34 M58 48 Q70 42 82 46', fill: 'none', stroke: '#90CAF9', 'stroke-width': 3 }),
    s('path', { d: 'M10 82 Q30 76 50 86 Q70 76 90 82 V88 Q70 82 50 92 Q30 82 10 88 Z', fill: '#1E88E5', ...o, 'stroke-width': 3 }),
  ],
  payung: () => [
    s('path', { d: 'M8 54 Q12 12 50 10 Q88 12 92 54 Q80 46 70 54 Q60 46 50 54 Q40 46 30 54 Q20 46 8 54 Z', fill: '#AB47BC', ...o }),
    s('path', { d: 'M50 10 Q36 30 30 54 M50 10 Q64 30 70 54', fill: 'none', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M50 54 V84 Q50 94 40 94 Q32 94 32 86', fill: 'none', ...o }),
  ],
  sapi: () => [
    s('ellipse', { cx: 50, cy: 58, rx: 34, ry: 28, fill: '#fff', ...o }),
    s('path', { d: 'M24 46 Q30 36 40 44 Q36 56 26 54 Z M62 64 Q72 56 80 66 Q72 76 64 72 Z', fill: '#4A3B3B' }),
    s('path', { d: 'M22 38 l-10 -10 M78 38 l10 -10', ...o, 'stroke-width': 6 }),
    s('ellipse', { cx: 50, cy: 74, rx: 18, ry: 11, fill: '#FFB3C7', ...o, 'stroke-width': 3 }),
    s('circle', { cx: 44, cy: 74, r: 2.5, fill: '#4A3B3B' }), s('circle', { cx: 56, cy: 74, r: 2.5, fill: '#4A3B3B' }),
    eye(38, 52), eye(62, 52),
  ],
  telur: () => [
    s('ellipse', { cx: 50, cy: 56, rx: 42, ry: 32, fill: '#fff', ...o }),
    s('circle', { cx: 50, cy: 54, r: 16, fill: '#FDD835', ...o, 'stroke-width': 3 }),
    s('ellipse', { cx: 45, cy: 49, rx: 4, ry: 3, fill: '#fff', opacity: 0.7 }),
  ],
  nasi: () => [
    s('path', { d: 'M12 50 Q50 64 88 50 Q84 88 50 90 Q16 88 12 50 Z', fill: '#4FC3F7', ...o }),
    s('path', { d: 'M14 50 Q20 24 50 22 Q80 24 86 50 Q50 62 14 50 Z', fill: '#fff', ...o }),
    ...[[34, 38], [50, 32], [64, 40], [42, 48], [58, 50]].map(([x, y]) => s('ellipse', { cx: x, cy: y, rx: 3, ry: 1.6, fill: '#E0E0E0' })),
  ],
  'layang-layang': () => [
    s('path', { d: 'M50 6 L84 40 L50 80 L16 40 Z', fill: '#FDD835', ...o }),
    s('path', { d: 'M50 6 V80 M16 40 H84', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M50 6 L84 40 L50 40 Z M16 40 L50 80 L50 40 Z', fill: '#E53935' }),
    s('path', { d: 'M50 80 Q40 88 50 92 Q60 96 52 100', fill: 'none', ...o, 'stroke-width': 2.5 }),
  ],
  domba: () => [
    s('path', { d: 'M24 62 Q14 50 26 40 Q28 26 44 30 Q54 20 66 30 Q82 28 82 44 Q92 56 80 66 Q76 80 60 76 Q48 84 38 76 Q22 78 24 62 Z', fill: '#fff', ...o }),
    s('ellipse', { cx: 24, cy: 50, rx: 12, ry: 14, fill: '#4A3B3B' }),
    s('circle', { cx: 21, cy: 47, r: 2.5, fill: '#fff' }),
    s('path', { d: 'M40 76 v14 M64 76 v14', ...o, 'stroke-width': 6 }),
  ],
  gitar: () => [
    s('path', { d: 'M40 44 Q22 40 20 60 Q18 86 42 88 Q58 90 62 76 Q74 76 74 62 Q74 46 58 50 Q56 44 40 44 Z', fill: '#D7A36B', ...o }),
    s('circle', { cx: 46, cy: 66, r: 8, fill: '#4A3B3B' }),
    s('path', { d: 'M54 58 L86 18', stroke: '#8D5A33', 'stroke-width': 8, 'stroke-linecap': 'round' }),
    s('rect', { x: 80, y: 6, width: 12, height: 18, rx: 3, fill: '#8D5A33', transform: 'rotate(40 86 15)', ...o, 'stroke-width': 2.5 }),
  ],
  roket: () => [
    s('path', { d: 'M50 6 Q72 24 70 62 H30 Q28 24 50 6 Z', fill: '#ECEFF1', ...o }),
    s('circle', { cx: 50, cy: 34, r: 9, fill: '#64B5F6', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M30 50 L16 72 H30 Z M70 50 L84 72 H70 Z', fill: '#E53935', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M38 62 Q50 98 62 62 Z', fill: '#FFA94D', ...o, 'stroke-width': 3 }),
  ],
  hujan: () => [
    s('path', { d: 'M20 50 Q8 50 10 38 Q12 26 26 28 Q30 12 48 14 Q62 8 70 22 Q90 20 90 36 Q92 50 76 50 Z', fill: '#B0BEC5', ...o }),
    ...[[26, 62], [46, 66], [66, 62], [36, 82], [58, 84], [78, 78]].map(([x, y]) => s('path', { d: `M${x} ${y} q-5 8 0 10 q5 -2 0 -10 z`, fill: '#1E88E5' })),
  ],
  jagung: () => [
    s('path', { d: 'M50 10 Q68 30 64 70 Q60 88 50 90 Q40 88 36 70 Q32 30 50 10 Z', fill: '#FDD835', ...o }),
    ...[22, 34, 46, 58, 70].map((y) => s('path', { d: `M40 ${y} H60`, stroke: '#E0A800', 'stroke-width': 2.5 })),
    s('path', { d: 'M50 40 V86 M43 30 V80 M57 30 V80', stroke: '#E0A800', 'stroke-width': 2 }),
    s('path', { d: 'M36 70 Q20 60 22 40 Q40 50 46 88 Z M64 70 Q80 60 78 40 Q60 50 54 88 Z', fill: '#43A047', ...o, 'stroke-width': 3 }),
  ],
  ceri: () => [
    s('path', { d: 'M34 64 Q40 30 62 12 Q66 30 70 62', fill: 'none', ...o, stroke: '#43A047' }),
    s('ellipse', { cx: 70, cy: 14, rx: 10, ry: 5, fill: '#43A047', transform: 'rotate(-20 70 14)' }),
    s('circle', { cx: 32, cy: 72, r: 16, fill: '#C62828', ...o }),
    s('circle', { cx: 70, cy: 72, r: 16, fill: '#C62828', ...o }),
    s('circle', { cx: 26, cy: 66, r: 4, fill: '#fff', opacity: 0.5 }), s('circle', { cx: 64, cy: 66, r: 4, fill: '#fff', opacity: 0.5 }),
  ],
  wafer: () => [
    s('rect', { x: 12, y: 30, width: 76, height: 40, rx: 4, fill: '#E0A96D', ...o }),
    s('path', { d: 'M12 44 H88 M12 56 H88', stroke: '#8D6E63', 'stroke-width': 4 }),
    s('path', { d: 'M24 30 V70 M38 30 V70 M52 30 V70 M66 30 V70 M80 30 V70', stroke: '#C68B52', 'stroke-width': 2 }),
  ],
  yogurt: () => [
    s('path', { d: 'M24 30 H76 L68 90 H32 Z', fill: '#fff', ...o }),
    s('rect', { x: 20, y: 20, width: 60, height: 12, rx: 4, fill: '#FF8FB1', ...o, 'stroke-width': 3 }),
    s('path', { d: 'M30 52 H70 L66 76 H34 Z', fill: '#FF8FB1' }),
    s('circle', { cx: 50, cy: 64, r: 6, fill: '#E53935' }),
  ],
} satisfies Record<string, () => SVGElement[]>;

export type ArtId = CountObject | keyof typeof DRAW | 'monyet';
export const ART_IDS: readonly ArtId[] = [...COUNT_OBJECTS, ...(Object.keys(DRAW) as (keyof typeof DRAW)[]), 'monyet'];

/** Any drawable thing by id (count objects included). */
export function thing(id: ArtId): SVGSVGElement {
  if (id === 'monyet') return monyet();
  if ((COUNT_OBJECTS as readonly string[]).includes(id)) return countObject(id as CountObject);
  return svgRoot('0 0 100 100', DRAW[id as keyof typeof DRAW](), { class: `obj obj-${id}` });
}
