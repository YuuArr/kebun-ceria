import { createRng } from '../core/rng';
import { draw, GARDEN_ITEMS, type GardenItem, type Kind } from './garden-items';
import { s } from './svg';

/**
 * Stages 1–40: plants and animals arrive (GARDEN_ITEMS).
 * Stages 41–80: each of those grows up, in the same order ("naik kelas").
 * Stages 81–120: garden decorations.
 */
export const BASE_STAGES = 40;

const o = { stroke: '#4A3B3B', 'stroke-width': 3, 'stroke-linejoin': 'round' } as const;

const PLANT_CLUSTER: readonly Kind[] = ['grass', 'flower', 'mushroom', 'sunflower'];
const BABY: readonly Kind[] = ['duck', 'cat', 'chick', 'frog', 'snail', 'ladybug', 'butterfly', 'bird', 'bee'];

/** The grown-up version of a base garden item. */
export function upgraded(kind: Kind, color: string): SVGGElement {
  if (PLANT_CLUSTER.includes(kind)) {
    return s('g', {}, [
      s('g', { transform: 'translate(-22 6) scale(.75)' }, [draw(kind, kind === 'flower' ? '#FDD835' : color)]),
      s('g', { transform: 'translate(22 6) scale(.75)' }, [draw(kind, kind === 'flower' ? '#FF8FB1' : color)]),
      draw(kind, color),
    ]);
  }
  if (kind === 'bush') return draw('berrybush', color);
  if (kind === 'berrybush') return s('g', {}, [draw('berrybush', color), s('g', { transform: 'translate(0 -52) scale(.7)', class: 'float' }, [draw('butterfly', '#AB47BC')])]);
  if (kind === 'tree') return draw('fruittree', '#E53935');
  if (kind === 'fruittree') return s('g', {}, [draw('fruittree', color), s('g', { transform: 'translate(8 -128) scale(.8)' }, [draw('bird', '#1E88E5')])]);
  if (kind === 'rainbow') return s('g', {}, [draw('rainbow', color), s('g', { transform: 'translate(0 26) scale(.8)', opacity: 0.6 }, [draw('rainbow', color)])]);
  if (BABY.includes(kind)) return s('g', {}, [draw(kind, color), s('g', { transform: 'translate(30 4) scale(.55)' }, [draw(kind, color)])]);
  return draw(kind, color);
}

type Decor =
  | 'fence' | 'stone' | 'cloud' | 'lamp' | 'pot' | 'bench' | 'swing' | 'birdhouse' | 'scarecrow'
  | 'well' | 'pond' | 'house' | 'mailbox' | 'wheelbarrow' | 'kite' | 'signpost' | 'picnic' | 'windmill';

function decor(kind: Decor): SVGGElement {
  switch (kind) {
    case 'fence':
      return s('g', {}, [
        s('path', { d: 'M-34 -14 H34 M-34 -28 H34', stroke: '#C98B5A', 'stroke-width': 6 }),
        ...[-28, 0, 28].map((x) => s('path', { d: `M${x - 6} 0 V-36 L${x} -44 L${x + 6} -36 V0 Z`, fill: '#E8C9A0', ...o, 'stroke-width': 2 })),
      ]);
    case 'stone':
      return s('ellipse', { cx: 0, cy: -6, rx: 18, ry: 9, fill: '#BCAAA4', ...o, 'stroke-width': 2 });
    case 'cloud':
      return s('path', { d: 'M-40 0 Q-44 -18 -24 -18 Q-18 -34 2 -28 Q18 -40 30 -22 Q48 -20 44 0 Z', fill: '#fff', opacity: 0.95 });
    case 'lamp':
      return s('g', {}, [
        s('path', { d: 'M0 0 V-60', stroke: '#4A3B3B', 'stroke-width': 5 }),
        s('path', { d: 'M-12 -60 H12 L8 -78 H-8 Z', fill: '#FFF59D', ...o }),
      ]);
    case 'pot':
      return s('g', {}, [s('path', { d: 'M-14 0 L-18 -22 H18 L14 0 Z', fill: '#E57350', ...o }), s('g', { transform: 'translate(0 -22) scale(.7)' }, [draw('flower', '#AB47BC')])]);
    case 'bench':
      return s('g', {}, [
        s('rect', { x: -36, y: -30, width: 72, height: 8, fill: '#C98B5A', ...o, 'stroke-width': 2 }),
        s('rect', { x: -36, y: -46, width: 72, height: 8, fill: '#C98B5A', ...o, 'stroke-width': 2 }),
        s('path', { d: 'M-30 0 V-22 M30 0 V-22', stroke: '#4A3B3B', 'stroke-width': 5 }),
      ]);
    case 'swing':
      return s('g', {}, [
        s('path', { d: 'M-40 0 L-30 -90 H30 L40 0', fill: 'none', stroke: '#A0673D', 'stroke-width': 7 }),
        s('path', { d: 'M-12 -90 V-26 M12 -90 V-26', stroke: '#4A3B3B', 'stroke-width': 2 }),
        s('rect', { x: -18, y: -28, width: 36, height: 7, fill: '#E53935', ...o, 'stroke-width': 2 }),
      ]);
    case 'birdhouse':
      return s('g', {}, [
        s('path', { d: 'M0 0 V-50', stroke: '#A0673D', 'stroke-width': 6 }),
        s('rect', { x: -16, y: -82, width: 32, height: 32, fill: '#FFCC80', ...o }),
        s('path', { d: 'M-22 -80 L0 -100 L22 -80 Z', fill: '#E53935', ...o }),
        s('circle', { cx: 0, cy: -66, r: 6, fill: '#4A3B3B' }),
      ]);
    case 'scarecrow':
      return s('g', {}, [
        s('path', { d: 'M0 0 V-80 M-34 -56 H34', stroke: '#A0673D', 'stroke-width': 6 }),
        s('path', { d: 'M-18 -60 H18 L14 -28 H-14 Z', fill: '#1E88E5', ...o }),
        s('circle', { cx: 0, cy: -76, r: 13, fill: '#FFE0B2', ...o }),
        s('path', { d: 'M-20 -84 H20 L10 -100 H-10 Z', fill: '#FFA94D', ...o }),
      ]);
    case 'well':
      return s('g', {}, [
        s('rect', { x: -26, y: -34, width: 52, height: 34, fill: '#BCAAA4', ...o }),
        s('path', { d: 'M-22 -34 V-70 M22 -34 V-70', stroke: '#A0673D', 'stroke-width': 5 }),
        s('path', { d: 'M-32 -66 L0 -86 L32 -66 Z', fill: '#E57373', ...o }),
      ]);
    case 'pond':
      return s('g', {}, [
        s('ellipse', { cx: 0, cy: -12, rx: 60, ry: 18, fill: '#6EC6F0', ...o }),
        s('ellipse', { cx: -20, cy: -14, rx: 12, ry: 5, fill: '#66BB6A' }),
        s('ellipse', { cx: 22, cy: -8, rx: 10, ry: 4, fill: '#66BB6A' }),
        s('circle', { cx: -16, cy: -18, r: 4, fill: '#FF8FB1' }),
      ]);
    case 'house':
      return s('g', {}, [
        s('rect', { x: -40, y: -60, width: 80, height: 60, fill: '#FFF3E0', ...o }),
        s('path', { d: 'M-50 -58 L0 -100 L50 -58 Z', fill: '#FF8FB1', ...o }),
        s('path', { d: 'M-10 0 V-30 Q0 -40 10 -30 V0 Z', fill: '#A0673D', ...o, 'stroke-width': 2 }),
        s('circle', { cx: 24, cy: -38, r: 8, fill: '#BBDEFB', ...o, 'stroke-width': 2 }),
        s('ellipse', { cx: -28, cy: -104, rx: 5, ry: 14, fill: '#fff', ...o, 'stroke-width': 2, transform: 'rotate(-10 -28 -104)' }),
        s('ellipse', { cx: -16, cy: -104, rx: 5, ry: 14, fill: '#fff', ...o, 'stroke-width': 2, transform: 'rotate(10 -16 -104)' }),
      ]);
    case 'mailbox':
      return s('g', {}, [
        s('path', { d: 'M0 0 V-34', stroke: '#A0673D', 'stroke-width': 5 }),
        s('path', { d: 'M-16 -34 V-50 Q-16 -60 0 -60 Q16 -60 16 -50 V-34 Z', fill: '#1E88E5', ...o }),
        s('path', { d: 'M14 -52 V-66 H24 V-60 H14', fill: '#E53935' }),
      ]);
    case 'wheelbarrow':
      return s('g', {}, [
        s('path', { d: 'M-34 -36 H24 L14 -14 H-26 Z', fill: '#43A047', ...o }),
        s('circle', { cx: -8, cy: -8, r: 8, fill: '#4A3B3B' }),
        s('path', { d: 'M24 -36 L40 -44', stroke: '#A0673D', 'stroke-width': 4 }),
        s('circle', { cx: -16, cy: -40, r: 6, fill: '#E53935' }), s('circle', { cx: 0, cy: -42, r: 6, fill: '#FFA94D' }),
      ]);
    case 'kite':
      return s('g', { class: 'float' }, [
        s('path', { d: 'M0 -30 L18 0 L0 30 L-18 0 Z', fill: '#AB47BC', ...o }),
        s('path', { d: 'M0 30 Q-10 44 4 56 Q16 68 6 80', fill: 'none', stroke: '#4A3B3B', 'stroke-width': 2 }),
      ]);
    case 'signpost':
      return s('g', {}, [
        s('path', { d: 'M0 0 V-60', stroke: '#A0673D', 'stroke-width': 6 }),
        s('path', { d: 'M-30 -60 H22 L32 -50 L22 -40 H-30 Z', fill: '#FFCC80', ...o }),
        s('path', { d: 'M-20 -50 H14', stroke: '#A0673D', 'stroke-width': 3 }),
      ]);
    case 'picnic':
      return s('g', {}, [
        s('path', { d: 'M-46 0 L-30 -24 H34 L50 0 Z', fill: '#EF5350', ...o }),
        s('path', { d: 'M-38 -12 H42 M-14 -24 L-18 0 M10 -24 L14 0', stroke: '#fff', 'stroke-width': 3 }),
        s('rect', { x: -6, y: -40, width: 24, height: 18, rx: 3, fill: '#D7A36B', ...o, 'stroke-width': 2 }),
      ]);
    case 'windmill':
      return s('g', {}, [
        s('path', { d: 'M-14 0 L-8 -80 H8 L14 0 Z', fill: '#FFF3E0', ...o }),
        // Outer group positions; inner group spins (a CSS animation would override a transform attribute).
        s('g', { transform: 'translate(0 -80)' }, [
          s('g', { class: 'spin-slow' }, [0, 90, 180, 270].map((a) => s('path', { d: 'M0 0 L8 -40 L-6 -40 Z', fill: '#90CAF9', ...o, 'stroke-width': 2, transform: `rotate(${a})` }))),
        ]),
      ]);
  }
}

const DECOR_ORDER: readonly Decor[] = [
  'fence', 'stone', 'pot', 'cloud', 'fence', 'stone', 'bench', 'lamp', 'fence', 'stone',
  'birdhouse', 'pot', 'fence', 'cloud', 'stone', 'mailbox', 'fence', 'lamp', 'swing', 'stone',
  'fence', 'pot', 'scarecrow', 'cloud', 'fence', 'lamp', 'wheelbarrow', 'stone', 'fence', 'signpost',
  'pot', 'well', 'kite', 'lamp', 'picnic', 'cloud', 'pond', 'fence', 'windmill', 'house',
];

interface DecorItem { stage: number; kind: Decor; x: number; y: number; scale: number }

/** Fixed decoration layout (constant seed): fences along the bottom, stones on the path, clouds in the sky. */
const DECOR_ITEMS: readonly DecorItem[] = (() => {
  const rng = createRng(1203);
  let fence = 0, stone = 0, cloud = 0;
  return DECOR_ORDER.map((kind, i) => {
    let x: number, y: number;
    if (kind === 'fence') { x = 60 + fence++ * 110; y = 556; }
    else if (kind === 'stone') { const t = (stone++ + 0.5) / 6; x = 430 + t * 120; y = 545 - t * 210; }
    else if (kind === 'cloud' || kind === 'kite') { x = 120 + cloud++ * 230 + rng.int(-30, 30); y = rng.int(40, 120); }
    else { x = rng.int(70, 930); y = rng.int(330, 500); }
    const big = kind === 'house' || kind === 'windmill' || kind === 'swing';
    return { stage: BASE_STAGES * 2 + i + 1, kind, x, y, scale: big ? 1.3 : 1 };
  });
})();

export interface SceneItem {
  /** Stage that made this item appear or change (for the grow-in animation). */
  stage: number;
  y: number;
  el: SVGGElement;
}

/** Everything to draw for a given growth (0–120), back to front. */
export function gardenScene(growth: number): SceneItem[] {
  const out: SceneItem[] = [];
  for (const it of GARDEN_ITEMS) {
    if (it.stage > growth) continue;
    const up = growth >= it.stage + BASE_STAGES;
    out.push({ stage: up ? it.stage + BASE_STAGES : it.stage, y: it.kind === 'rainbow' ? -1 : it.y, el: place(it, up ? upgraded(it.kind, it.color) : draw(it.kind, it.color), up ? it.stage + BASE_STAGES : it.stage) });
  }
  for (const d of DECOR_ITEMS) {
    if (d.stage > growth) continue;
    out.push({ stage: d.stage, y: d.y, el: wrap(d.stage, d.x, d.y, d.scale, decor(d.kind), d.kind) });
  }
  return out.sort((a, b) => a.y - b.y);
}

function place(it: GardenItem, art: SVGGElement, stage: number): SVGGElement {
  return wrap(stage, it.x, it.y, it.scale, art, it.kind);
}

const SKY_KINDS = ['butterfly', 'bird', 'bee', 'rainbow', 'cloud', 'kite'];

function wrap(stage: number, x: number, y: number, scale: number, art: SVGGElement, kind: string): SVGGElement {
  return itemGroup({ stage, x, y, scale, kind, zone: SKY_KINDS.includes(kind) ? 'sky' : 'ground' }, art);
}

/** A placed garden thing with everything the map needs to react to it and move it. */
export function itemGroup(o: { stage: number; x: number; y: number; scale: number; kind: string; zone: 'sky' | 'ground' }, art: SVGGElement): SVGGElement {
  // Base things and their grown-up versions share one key, so a moved thing stays put after it grows.
  const key = o.stage > 80 ? o.stage : ((o.stage - 1) % 40) + 1;
  return s('g', {
    class: 'garden-item', 'data-stage': o.stage, 'data-key': key, 'data-kind': o.kind, 'data-zone': o.zone,
    'data-x': o.x, 'data-y': o.y, 'data-scale': o.scale, transform: `translate(${o.x} ${o.y}) scale(${o.scale})`,
  }, [s('g', { class: 'garden-item-inner' }, [art])]);
}
