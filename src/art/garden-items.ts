import { createRng } from '../core/rng';
import { s } from './svg';

type Kind =
  | 'grass' | 'flower' | 'bush' | 'berrybush' | 'tree' | 'fruittree' | 'mushroom' | 'sunflower'
  | 'butterfly' | 'bird' | 'bee' | 'rainbow'
  | 'duck' | 'cat' | 'snail' | 'ladybug' | 'chick' | 'frog';

const SKY: readonly Kind[] = ['butterfly', 'bird', 'bee', 'rainbow'];

/** Growth order: plants first, then animals arrive. 40 stages. */
const ORDER: readonly [Kind, string?][] = [
  ['grass'], ['flower', '#E53935'], ['flower', '#FDD835'], ['bush'], ['flower', '#1E88E5'],
  ['mushroom'], ['tree'], ['butterfly', '#FF8FB1'], ['grass'], ['flower', '#FF8FB1'],
  ['snail'], ['fruittree', '#E53935'], ['bird', '#1E88E5'], ['sunflower'], ['berrybush'],
  ['duck'], ['flower', '#AB47BC'], ['butterfly', '#FDD835'], ['ladybug'], ['tree'],
  ['chick'], ['flower', '#E53935'], ['bird', '#E53935'], ['mushroom'], ['cat'],
  ['grass'], ['fruittree', '#FFA94D'], ['bee'], ['frog'], ['flower', '#1E88E5'],
  ['bush'], ['butterfly', '#43A047'], ['sunflower'], ['bird', '#FDD835'], ['flower', '#FDD835'],
  ['duck'], ['tree'], ['bee'], ['berrybush'], ['rainbow'],
];

export interface GardenItem {
  stage: number;
  kind: Kind;
  x: number;
  y: number;
  scale: number;
  color: string;
}

/** Fixed layout in a 1000×560 map, generated once with a constant seed so it never moves. */
export const GARDEN_ITEMS: readonly GardenItem[] = (() => {
  const rng = createRng(20261126);
  const placed: GardenItem[] = [];
  ORDER.forEach(([kind, color], i) => {
    const sky = SKY.includes(kind);
    let best = { x: 500, y: 400, d: -1 };
    for (let tries = 0; tries < 40; tries++) {
      const x = kind === 'rainbow' ? 500 : rng.int(60, 940);
      const y = kind === 'rainbow' ? 170 : sky ? rng.int(70, 230) : rng.int(300, 470);
      const d = Math.min(Infinity, ...placed.map((p) => Math.hypot(p.x - x, (p.y - y) * 1.6)));
      if (d > best.d) best = { x, y, d };
      if (d > 110) break;
    }
    const big = kind === 'tree' || kind === 'fruittree';
    placed.push({ stage: i + 1, kind, x: best.x, y: best.y, scale: big ? 1.4 : 1, color: color ?? '#E53935' });
  });
  return placed;
})();

const outline = { stroke: '#4A3B3B', 'stroke-width': 3, 'stroke-linejoin': 'round' } as const;

function flowerHead(color: string, r = 9) {
  return s('g', {}, [
    ...[0, 72, 144, 216, 288].map((a) => s('circle', { cx: 0, cy: -r, r, fill: color, transform: `rotate(${a})`, ...outline, 'stroke-width': 2 })),
    s('circle', { r: r * 0.7, fill: '#FFD54F', ...outline, 'stroke-width': 2 }),
  ]);
}

function draw(kind: Kind, color: string): SVGGElement {
  switch (kind) {
    case 'grass':
      return s('g', {}, [s('path', { d: 'M-20 0 Q-16 -30 -8 -6 Q-2 -40 4 -6 Q12 -32 20 0 Z', fill: '#4E9F50' })]);
    case 'flower':
      return s('g', {}, [
        s('path', { d: 'M0 0 V-40', stroke: '#2E7D32', 'stroke-width': 5 }),
        s('ellipse', { cx: 8, cy: -16, rx: 9, ry: 4, fill: '#43A047', transform: 'rotate(-30 8 -16)' }),
        s('g', { transform: 'translate(0 -46)' }, [flowerHead(color)]),
      ]);
    case 'sunflower':
      return s('g', {}, [
        s('path', { d: 'M0 0 V-70', stroke: '#2E7D32', 'stroke-width': 6 }),
        s('g', { transform: 'translate(0 -80)' }, [
          ...Array.from({ length: 12 }, (_, i) => s('ellipse', { cx: 0, cy: -18, rx: 6, ry: 12, fill: '#FDD835', transform: `rotate(${i * 30})`, ...outline, 'stroke-width': 1.5 })),
          s('circle', { r: 12, fill: '#8D5524', ...outline }),
        ]),
      ]);
    case 'bush':
    case 'berrybush':
      return s('g', {}, [
        s('path', { d: 'M-40 0 Q-46 -30 -20 -34 Q-10 -56 12 -42 Q40 -50 42 -20 Q50 -4 40 0 Z', fill: '#43A047', ...outline }),
        ...(kind === 'berrybush'
          ? [[-18, -20], [4, -30], [22, -14], [-4, -10]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 5, fill: '#E53935' }))
          : []),
      ]);
    case 'tree':
    case 'fruittree':
      return s('g', {}, [
        s('rect', { x: -9, y: -50, width: 18, height: 50, fill: '#A0673D', ...outline }),
        s('circle', { cx: 0, cy: -80, r: 42, fill: '#4CAF50', ...outline }),
        s('circle', { cx: -26, cy: -62, r: 22, fill: '#4CAF50', ...outline }),
        s('circle', { cx: 26, cy: -62, r: 22, fill: '#4CAF50', ...outline }),
        ...(kind === 'fruittree'
          ? [[-20, -86], [14, -96], [22, -66], [-6, -64], [0, -110]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 7, fill: color, ...outline, 'stroke-width': 2 }))
          : []),
      ]);
    case 'mushroom':
      return s('g', {}, [
        s('rect', { x: -7, y: -18, width: 14, height: 18, rx: 4, fill: '#FFF3E0', ...outline }),
        s('path', { d: 'M-22 -16 Q0 -48 22 -16 Z', fill: '#E53935', ...outline }),
        s('circle', { cx: -8, cy: -26, r: 3.5, fill: '#fff' }),
        s('circle', { cx: 8, cy: -24, r: 3, fill: '#fff' }),
      ]);
    case 'butterfly':
      return s('g', { class: 'float' }, [
        s('ellipse', { cx: -12, cy: -6, rx: 13, ry: 10, fill: color, ...outline, 'stroke-width': 2 }),
        s('ellipse', { cx: 12, cy: -6, rx: 13, ry: 10, fill: color, ...outline, 'stroke-width': 2 }),
        s('ellipse', { cx: -9, cy: 8, rx: 8, ry: 7, fill: color, ...outline, 'stroke-width': 2 }),
        s('ellipse', { cx: 9, cy: 8, rx: 8, ry: 7, fill: color, ...outline, 'stroke-width': 2 }),
        s('rect', { x: -2.5, y: -14, width: 5, height: 28, rx: 2.5, fill: '#4A3B3B' }),
      ]);
    case 'bird':
      return s('g', { class: 'float' }, [
        s('ellipse', { cx: 0, cy: 0, rx: 18, ry: 14, fill: color, ...outline }),
        s('path', { d: 'M-4 -2 Q-12 -20 6 -8 Z', fill: color, ...outline, 'stroke-width': 2 }),
        s('circle', { cx: 9, cy: -4, r: 2.5, fill: '#4A3B3B' }),
        s('path', { d: 'M17 -2 l9 3 l-9 3 z', fill: '#FFA94D' }),
      ]);
    case 'bee':
      return s('g', { class: 'float' }, [
        s('ellipse', { cx: -4, cy: -12, rx: 8, ry: 6, fill: '#E3F2FD', ...outline, 'stroke-width': 2 }),
        s('ellipse', { cx: 6, cy: -12, rx: 8, ry: 6, fill: '#E3F2FD', ...outline, 'stroke-width': 2 }),
        s('ellipse', { cx: 0, cy: 0, rx: 16, ry: 11, fill: '#FDD835', ...outline }),
        s('path', { d: 'M-4 -10 V10 M5 -10 V10', stroke: '#4A3B3B', 'stroke-width': 4 }),
        s('circle', { cx: 11, cy: -2, r: 2, fill: '#4A3B3B' }),
      ]);
    case 'rainbow':
      return s('g', { opacity: 0.85 }, ['#E53935', '#FFA94D', '#FDD835', '#43A047', '#1E88E5', '#AB47BC'].map((c, i) =>
        s('path', { d: `M${-260 + i * 14} 120 A${260 - i * 14} ${200 - i * 14} 0 0 1 ${260 - i * 14} 120`, fill: 'none', stroke: c, 'stroke-width': 14 }),
      ));
    case 'duck':
      return s('g', {}, [
        s('ellipse', { cx: 0, cy: -16, rx: 22, ry: 15, fill: '#FDD835', ...outline }),
        s('circle', { cx: 16, cy: -36, r: 12, fill: '#FDD835', ...outline }),
        s('path', { d: 'M26 -36 l12 3 l-12 4 z', fill: '#FFA94D', ...outline, 'stroke-width': 2 }),
        s('circle', { cx: 19, cy: -39, r: 2.5, fill: '#4A3B3B' }),
      ]);
    case 'chick':
      return s('g', {}, [
        s('circle', { cx: 0, cy: -14, r: 14, fill: '#FFEE58', ...outline }),
        s('path', { d: 'M12 -16 l8 2 l-8 3 z', fill: '#FFA94D' }),
        s('circle', { cx: 5, cy: -18, r: 2, fill: '#4A3B3B' }),
      ]);
    case 'cat':
      return s('g', {}, [
        s('ellipse', { cx: 0, cy: -16, rx: 24, ry: 16, fill: '#FFB74D', ...outline }),
        s('circle', { cx: 18, cy: -34, r: 14, fill: '#FFB74D', ...outline }),
        s('path', { d: 'M8 -44 l2 -12 l8 8 Z M22 -46 l8 -10 l2 12 Z', fill: '#FFB74D', ...outline, 'stroke-width': 2 }),
        s('circle', { cx: 14, cy: -36, r: 2, fill: '#4A3B3B' }),
        s('circle', { cx: 23, cy: -36, r: 2, fill: '#4A3B3B' }),
        s('path', { d: 'M-24 -18 q-16 -10 -10 -26', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 5, 'stroke-linecap': 'round' }),
      ]);
    case 'snail':
      return s('g', {}, [
        s('path', { d: 'M-22 0 H22 Q30 0 28 -8 L20 -8 Z', fill: '#BCAAA4', ...outline, 'stroke-width': 2 }),
        s('circle', { cx: -2, cy: -16, r: 15, fill: '#FF8A65', ...outline }),
        s('path', { d: 'M-2 -16 m-7 0 a7 7 0 1 0 7 -7', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 2 }),
      ]);
    case 'ladybug':
      return s('g', {}, [
        s('circle', { cx: 0, cy: -10, r: 12, fill: '#E53935', ...outline, 'stroke-width': 2 }),
        s('path', { d: 'M0 -22 V2', stroke: '#4A3B3B', 'stroke-width': 2 }),
        s('circle', { cx: -5, cy: -12, r: 2.5, fill: '#4A3B3B' }),
        s('circle', { cx: 5, cy: -6, r: 2.5, fill: '#4A3B3B' }),
      ]);
    case 'frog':
      return s('g', {}, [
        s('ellipse', { cx: 0, cy: -12, rx: 22, ry: 14, fill: '#66BB6A', ...outline }),
        s('circle', { cx: -10, cy: -26, r: 7, fill: '#fff', ...outline, 'stroke-width': 2 }),
        s('circle', { cx: 10, cy: -26, r: 7, fill: '#fff', ...outline, 'stroke-width': 2 }),
        s('circle', { cx: -10, cy: -26, r: 3, fill: '#4A3B3B' }),
        s('circle', { cx: 10, cy: -26, r: 3, fill: '#4A3B3B' }),
        s('path', { d: 'M-8 -10 q8 6 16 0', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 2 }),
      ]);
  }
}

/** Group for one garden stage placed on the map. */
export function gardenItem(item: GardenItem): SVGGElement {
  return s('g', { class: 'garden-item', 'data-stage': item.stage, transform: `translate(${item.x} ${item.y}) scale(${item.scale})` }, [
    s('g', { class: 'garden-item-inner' }, [draw(item.kind, item.color)]),
  ]);
}

/** The empty garden: sky, sun, hills, ground and path. */
export function gardenBackdrop(): SVGGElement {
  return s('g', {}, [
    s('rect', { width: 1000, height: 560, fill: '#BDE6FF' }),
    s('circle', { cx: 880, cy: 80, r: 46, fill: '#FFE066' }),
    s('g', { fill: '#fff', opacity: 0.9 }, [
      s('ellipse', { cx: 180, cy: 90, rx: 60, ry: 22 }), s('ellipse', { cx: 220, cy: 76, rx: 40, ry: 22 }),
      s('ellipse', { cx: 620, cy: 60, rx: 50, ry: 18 }), s('ellipse', { cx: 650, cy: 48, rx: 32, ry: 18 }),
    ]),
    s('path', { d: 'M0 300 Q200 200 420 280 T1000 250 V560 H0 Z', fill: '#A5D6A7' }),
    s('path', { d: 'M0 330 Q300 280 600 320 T1000 310 V560 H0 Z', fill: '#7CC36E' }),
    s('path', { d: 'M420 560 Q480 460 520 420 T560 330', fill: 'none', stroke: '#E8C9A0', 'stroke-width': 40, 'stroke-linecap': 'round' }),
  ]);
}
