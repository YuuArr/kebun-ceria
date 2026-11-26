import { createRng } from '../core/rng';
import type { ThemeId } from '../core/garden';
import { gardenBackdrop } from './garden-items';
import { gardenScene, type SceneItem } from './garden-more';
import { ART, DECOR_ART, garden, thingAt } from './theme-art';
import { s } from './svg';

type Make = () => SVGGElement;
interface Spot { make: Make; type: 'plant' | 'animal' | 'sky'; big?: boolean }
interface DecorSpot { make: Make; place: 'border' | 'path' | 'sky' | 'ground'; big?: boolean }
interface ThemeDef { name: string; seed: number; backdrop: () => SVGGElement; base: Spot[]; decor: DecorSpot[] }

const P = (make: Make, big = false): Spot => ({ make, type: 'plant', big });
const A = (make: Make): Spot => ({ make, type: 'animal' });
const SKY = (make: Make): Spot => ({ make, type: 'sky' });
const D = (make: Make, place: DecorSpot['place'] = 'ground', big = false): DecorSpot => ({ make, place, big });
const cycle = <T,>(list: T[], n: number) => Array.from({ length: n }, (_, i) => list[i % list.length]);
/** Exactly 40 decorations: the last one (the big centrepiece) stays last; gaps are filled from the middle of the list. */
const forty = (list: DecorSpot[]): DecorSpot[] => {
  const last = list[list.length - 1];
  const rest = list.slice(0, -1);
  const fill = rest.slice(18);
  while (rest.length < 39) rest.push(fill[rest.length % fill.length]);
  return [...rest.slice(0, 39), last];
};

const hills = (sky: Make, far: string, near: string, ground: string, extra: SVGElement[] = []) => (): SVGGElement =>
  s('g', {}, [
    sky(),
    ...extra,
    s('path', { d: 'M0 300 Q200 210 420 280 T1000 250 V560 H0 Z', fill: far }),
    s('path', { d: 'M0 330 Q300 280 600 320 T1000 310 V560 H0 Z', fill: near }),
    s('path', { d: 'M420 560 Q480 460 520 420 T560 330', fill: 'none', stroke: ground, 'stroke-width': 40, 'stroke-linecap': 'round' }),
  ]);

export const THEME_DEFS: Record<Exclude<ThemeId, 'bunga'>, ThemeDef> = {
  buah: {
    name: 'Kebun Buah',
    seed: 2024,
    backdrop: hills(
      () => s('g', {}, [s('rect', { width: 1000, height: 560, fill: '#FFE0B2' }), s('circle', { cx: 820, cy: 230, r: 90, fill: '#FFB74D' }), s('ellipse', { cx: 200, cy: 90, rx: 70, ry: 22, fill: '#FFCCBC' })]),
      '#AED581', '#8BC34A', '#E8C9A0',
    ),
    base: cycle([
      P(() => garden('fruittree', '#E53935'), true), P(() => thingAt('stroberi', 40)), P(() => ART.semangka()), A(() => garden('bird', '#1E88E5')),
      P(() => garden('fruittree', '#FFA94D'), true), P(() => thingAt('nanas', 56)), P(() => ART.labu()), SKY(() => garden('bee')),
      P(() => garden('fruittree', '#C0CA33'), true), P(() => thingAt('anggur', 48)), A(() => garden('chick')), P(() => ART.keranjang()),
      SKY(() => garden('butterfly', '#FFA94D')), P(() => thingAt('pisang', 46)), A(() => garden('ladybug')),
    ], 40),
    decor: forty([
      ...cycle([D(() => DECOR_ART.pagar_bambu(), 'border')], 8),
      ...cycle([D(() => garden('mushroom'), 'path')], 6),
      D(() => ART.keranjang()), D(() => ART.keranjang()), D(() => ART.labu()), D(() => ART.labu()),
      ...cycle([D(() => s('path', { d: 'M-40 0 Q-44 -18 -24 -18 Q-18 -34 2 -28 Q18 -40 30 -22 Q48 -20 44 0 Z', fill: '#FFCCBC' }), 'sky')], 4),
      D(() => thingAt('nanas', 50)), D(() => ART.semangka()), D(() => garden('sunflower')), D(() => garden('sunflower')),
      D(() => garden('berrybush')), D(() => garden('berrybush')), D(() => thingAt('apel', 34)), D(() => thingAt('jeruk', 34)),
      D(() => thingAt('anggur', 40)), D(() => garden('cat')), D(() => garden('duck')), D(() => garden('snail')),
      D(() => garden('flower', '#FF8FB1')), D(() => garden('flower', '#FDD835')), D(() => thingAt('roda', 30)), D(() => ART.keranjang(), 'ground', true),
    ]),
  },
  laut: {
    name: 'Taman Laut',
    seed: 77,
    backdrop: () => s('g', {}, [
      s('defs', {}, [s('linearGradient', { id: 'sea', x1: 0, y1: 0, x2: 0, y2: 1 }, [s('stop', { offset: 0, 'stop-color': '#81D4FA' }), s('stop', { offset: 1, 'stop-color': '#0277BD' })])]),
      s('rect', { width: 1000, height: 560, fill: 'url(#sea)' }),
      ...[150, 420, 720].map((x) => s('path', { d: `M${x} 0 L${x + 60} 0 L${x + 160} 420 L${x + 40} 420 Z`, fill: '#fff', opacity: 0.08 })),
      s('path', { d: 'M0 360 Q250 320 500 350 T1000 340 V560 H0 Z', fill: '#FFE0B2' }),
      s('path', { d: 'M0 420 Q300 390 600 420 T1000 410 V560 H0 Z', fill: '#FFD180' }),
    ]),
    base: cycle([
      P(() => ART.karang('#FF7043')), A(() => ART.ikan_warna('#FDD835')), P(() => ART.rumput_laut()), A(() => ART.kepiting()),
      P(() => ART.karang('#EC407A')), SKY(() => ART.ubur()), A(() => ART.penyu()), P(() => ART.kerang()),
      A(() => ART.ikan_warna('#4FC3F7')), P(() => thingAt('bintang-laut', 40)), A(() => ART.gurita()), SKY(() => ART.gelembung()),
      P(() => ART.karang('#AB47BC')), A(() => thingAt('ikan', 44)), SKY(() => ART.ikan_warna('#FF8A65')),
    ], 40),
    decor: forty([
      ...cycle([D(() => ART.kerang(), 'border')], 8),
      ...cycle([D(() => DECOR_ART.batu_laut(), 'path')], 6),
      ...cycle([D(() => ART.gelembung(), 'sky')], 4),
      D(() => DECOR_ART.kotak_harta()), D(() => DECOR_ART.jangkar()), D(() => DECOR_ART.istana_pasir()), D(() => ART.rumput_laut()),
      D(() => ART.karang('#FFCA28')), D(() => ART.karang('#26C6DA')), D(() => ART.rumput_laut()), D(() => thingAt('bintang-laut', 34)),
      D(() => ART.kepiting()), D(() => ART.kerang()), D(() => ART.ikan_warna('#AED581')), D(() => DECOR_ART.batu_laut()),
      D(() => ART.gurita()), D(() => DECOR_ART.istana_pasir()), D(() => ART.penyu()), D(() => DECOR_ART.jangkar()),
      D(() => ART.karang('#FF7043')), D(() => DECOR_ART.kotak_harta()), D(() => ART.rumput_laut()), D(() => DECOR_ART.kapal_karam(), 'ground', true),
    ]),
  },
  hutan: {
    name: 'Hutan Ajaib',
    seed: 404,
    backdrop: hills(
      () => s('g', {}, [
        s('defs', {}, [s('linearGradient', { id: 'dusk', x1: 0, y1: 0, x2: 0, y2: 1 }, [s('stop', { offset: 0, 'stop-color': '#4527A0' }), s('stop', { offset: 1, 'stop-color': '#9575CD' })])]),
        s('rect', { width: 1000, height: 560, fill: 'url(#dusk)' }),
        s('path', { d: 'M860 40 a46 46 0 1 0 40 70 a36 36 0 1 1 -40 -70 Z', fill: '#FFF59D' }),
        ...[[80, 60], [230, 120], [400, 40], [620, 90], [720, 30], [960, 160]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 3, fill: '#FFF9C4' })),
      ]),
      '#2E7D32', '#388E3C', '#6D4C41',
    ),
    base: cycle([
      P(() => ART.cemara(), true), P(() => garden('mushroom')), A(() => ART.burung_hantu()), SKY(() => ART.kunang()),
      P(() => ART.pakis()), A(() => ART.rusa()), P(() => garden('tree'), true), P(() => garden('flower', '#4FC3F7')),
      SKY(() => garden('butterfly', '#CE93D8')), A(() => garden('frog')), P(() => ART.cemara(), true), A(() => garden('snail')),
      SKY(() => ART.kunang()), P(() => garden('mushroom')), A(() => garden('bird', '#FFA94D')),
    ], 40),
    decor: forty([
      ...cycle([D(() => DECOR_ART.lentera(), 'border')], 8),
      ...cycle([D(() => DECOR_ART.batu_laut(), 'path')], 6),
      ...cycle([D(() => ART.kunang(), 'sky')], 4),
      D(() => DECOR_ART.pintu_peri()), D(() => garden('mushroom')), D(() => DECOR_ART.jembatan()), D(() => ART.pakis()),
      D(() => ART.burung_hantu()), D(() => DECOR_ART.pintu_peri()), D(() => garden('mushroom')), D(() => ART.rusa()),
      D(() => ART.pakis()), D(() => garden('flower', '#CE93D8')), D(() => DECOR_ART.lentera()), D(() => garden('frog')),
      D(() => garden('mushroom')), D(() => ART.cemara()), D(() => garden('flower', '#4FC3F7')), D(() => DECOR_ART.pintu_peri()),
      D(() => ART.kunang()), D(() => DECOR_ART.lentera()), D(() => ART.pakis()), D(() => DECOR_ART.rumah_pohon(), 'ground', true),
    ]),
  },
};

export const themeName = (t: ThemeId) => (t === 'bunga' ? 'Kebun Bunga' : THEME_DEFS[t].name);

function upgradeOf(spot: Spot): SVGGElement {
  if (spot.type === 'plant') return s('g', {}, [s('g', { transform: 'translate(-24 6) scale(.7)' }, [spot.make()]), s('g', { transform: 'translate(24 6) scale(.7)' }, [spot.make()]), spot.make()]);
  if (spot.type === 'sky') return s('g', {}, [spot.make(), s('g', { transform: 'translate(36 -20) scale(.8)' }, [spot.make()])]);
  return s('g', {}, [spot.make(), s('g', { transform: 'translate(32 4) scale(.55)' }, [spot.make()])]);
}

const layoutCache = new Map<string, { base: { x: number; y: number; scale: number }[]; decor: { x: number; y: number; scale: number }[] }>();

function layout(id: Exclude<ThemeId, 'bunga'>) {
  const cached = layoutCache.get(id);
  if (cached) return cached;
  const def = THEME_DEFS[id];
  const rng = createRng(def.seed);
  const placed: { x: number; y: number }[] = [];
  const base = def.base.map((spot) => {
    let best = { x: 500, y: 400, d: -1 };
    for (let t = 0; t < 40; t++) {
      const x = rng.int(60, 940);
      const y = spot.type === 'sky' ? rng.int(70, 230) : rng.int(300, 470);
      const d = Math.min(Infinity, ...placed.map((p) => Math.hypot(p.x - x, (p.y - y) * 1.6)));
      if (d > best.d) best = { x, y, d };
      if (d > 110) break;
    }
    placed.push(best);
    return { x: best.x, y: best.y, scale: spot.big ? 1.4 : 1 };
  });
  let border = 0, path = 0, sky = 0;
  const decor = def.decor.map((d) => {
    let x: number, y: number;
    if (d.place === 'border') { x = 60 + border++ * 125; y = 556; }
    else if (d.place === 'path') { const t = (path++ + 0.5) / 6; x = 430 + t * 120; y = 545 - t * 210; }
    else if (d.place === 'sky') { x = 120 + sky++ * 230 + rng.int(-30, 30); y = rng.int(50, 140); }
    else { x = rng.int(70, 930); y = rng.int(330, 500); }
    return { x, y, scale: d.big ? 1.3 : 1 };
  });
  const out = { base, decor };
  layoutCache.set(id, out);
  return out;
}

const wrap = (stage: number, x: number, y: number, scale: number, art: SVGGElement) =>
  s('g', { class: 'garden-item', 'data-stage': stage, transform: `translate(${x} ${y}) scale(${scale})` }, [s('g', { class: 'garden-item-inner' }, [art])]);

/** Everything to draw for a theme at a visual step (0–120), back to front. */
export function themeScene(theme: ThemeId, visual: number): SceneItem[] {
  if (theme === 'bunga') return gardenScene(visual);
  const def = THEME_DEFS[theme];
  const lay = layout(theme);
  const out: SceneItem[] = [];
  def.base.forEach((spot, i) => {
    const stage = i + 1;
    if (stage > visual) return;
    const up = visual >= stage + 40;
    const p = lay.base[i];
    out.push({ stage: up ? stage + 40 : stage, y: p.y, el: wrap(up ? stage + 40 : stage, p.x, p.y, p.scale, up ? upgradeOf(spot) : spot.make()) });
  });
  def.decor.forEach((d, i) => {
    const stage = 81 + i;
    if (stage > visual) return;
    const p = lay.decor[i];
    out.push({ stage, y: p.y, el: wrap(stage, p.x, p.y, p.scale, d.make()) });
  });
  return out.sort((a, b) => a.y - b.y);
}

export function themeBackdrop(theme: ThemeId): SVGGElement {
  return theme === 'bunga' ? gardenBackdrop() : THEME_DEFS[theme].backdrop();
}
