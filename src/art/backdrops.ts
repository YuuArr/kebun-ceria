import { s } from './svg';

export type Scene = 'angka' | 'warna' | 'huruf' | 'pikiran' | 'rumah' | 'musik' | 'hewan';

const wave = (y: number, amp: number, len: number) => {
  let d = `M0 ${y}`;
  for (let x = 0; x < 1000; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
  return `${d} V600 H0 Z`;
};
const hill = (y: number, bumps: [number, number][]) => {
  let d = `M0 ${y}`;
  for (const [x, h] of bumps) d += ` Q${x - 80} ${y - h} ${x} ${y - h * 0.4}`;
  return `${d} L1000 ${y} V600 H0 Z`;
};
const flower = (x: number, y: number, c: string, r = 12) =>
  s('g', { transform: `translate(${x} ${y})` }, [
    ...[0, 72, 144, 216, 288].map((a) => s('circle', { cx: 0, cy: -r, r, fill: c, transform: `rotate(${a})` })),
    s('circle', { r: r * 0.7, fill: '#FFD54F' }),
  ]);
const cloud = (x: number, y: number, sc = 1) =>
  s('path', { d: 'M0 0 Q-6 -26 22 -24 Q34 -46 60 -34 Q86 -48 98 -22 Q124 -20 118 0 Z', fill: '#fff', transform: `translate(${x} ${y}) scale(${sc})` });
const star = (x: number, y: number, r: number, c: string) =>
  s('path', { d: 'M0 -10 L3 -3 L10 -3 L4 2 L6 10 L0 5 L-6 10 L-4 2 L-10 -3 L-3 -3 Z', fill: c, transform: `translate(${x} ${y}) scale(${r / 10})` });

/** Layered paper-cut scenery per area: a top band and a bottom band, so both stay visible on any screen shape. */
export function backdrop(scene: Scene): HTMLElement {
  const top: SVGElement[] = [];
  const bottom: SVGElement[] = [];
  let sky = '#FFF8E7';
  let wall = '';
  switch (scene) {
    case 'angka':
      sky = '#DFF3FF';
      top.push(cloud(80, 90, 0.9), cloud(760, 70, 1.1));
      bottom.push(s('path', { d: wave(470, 18, 160), fill: '#90CAF9' }), s('path', { d: wave(510, 16, 140), fill: '#64B5F6' }), s('path', { d: wave(550, 14, 120), fill: '#42A5F5' }));
      for (const [x, y, r] of [[120, 560, 30], [860, 575, 36], [520, 590, 24]] as const) {
        bottom.push(s('path', { d: `M${x} ${y} m${-r} 0 a${r} ${r * 0.45} 0 1 0 ${r * 2} 0 a${r} ${r * 0.45} 0 1 0 ${-r * 2} 0 Z M${x} ${y} l${r} -6 l0 12 Z`, fill: '#66BB6A', 'fill-rule': 'evenodd' }));
      }
      bottom.push(flower(130, 550, '#FF8FB1', 9));
      break;
    case 'warna':
      sky = '#FFF6E0';
      top.push(s('circle', { cx: 920, cy: 60, r: 60, fill: '#FFE082' }), s('circle', { cx: 920, cy: 60, r: 42, fill: '#FFD54F' }), cloud(120, 80, 0.8));
      bottom.push(s('path', { d: hill(480, [[200, 70], [450, 40], [720, 80], [1000, 50]]), fill: '#DCEDC8' }));
      bottom.push(s('path', { d: hill(520, [[150, 50], [420, 70], [700, 40], [980, 60]]), fill: '#C5E1A5' }));
      bottom.push(s('path', { d: hill(560, [[260, 40], [560, 50], [860, 45]]), fill: '#AED581' }));
      for (const [x, c] of [[60, '#E53935'], [180, '#1E88E5'], [330, '#FDD835'], [690, '#AB47BC'], [820, '#FF8FB1'], [950, '#FFA94D']] as const) bottom.push(flower(x, 545, c, 11));
      break;
    case 'huruf': {
      sky = '#FFEFF4';
      const flags = ['#E53935', '#FDD835', '#1E88E5', '#43A047', '#FFA94D', '#AB47BC', '#FF8FB1'];
      top.push(s('path', { d: 'M-10 20 Q250 80 500 30 T1010 30', fill: 'none', stroke: '#8D6E63', 'stroke-width': 3 }));
      for (let i = 0; i < 14; i++) {
        const x = 20 + i * 72;
        const y = 22 + 26 * Math.sin((i / 13) * Math.PI);
        top.push(s('path', { d: `M${x} ${y} l36 2 l-20 44 Z`, fill: flags[i % flags.length] }));
      }
      bottom.push(s('path', { d: hill(500, [[220, 60], [500, 40], [800, 70], [1000, 40]]), fill: '#F8BBD0' }));
      bottom.push(s('path', { d: hill(550, [[160, 40], [460, 60], [760, 40], [1000, 50]]), fill: '#F48FB1' }));
      break;
    }
    case 'pikiran':
      sky = '#F3E5F5';
      top.push(s('path', { d: 'M880 30 a46 46 0 1 0 40 70 a36 36 0 1 1 -40 -70 Z', fill: '#FFF59D' }));
      for (const [x, y, r] of [[90, 50, 14], [220, 100, 9], [400, 40, 11], [620, 85, 8], [760, 30, 12]] as const) top.push(star(x, y, r, '#FFF59D'));
      bottom.push(s('path', { d: hill(500, [[200, 50], [520, 70], [820, 40], [1000, 60]]), fill: '#E1BEE7' }));
      bottom.push(s('path', { d: hill(555, [[260, 50], [600, 40], [900, 60]]), fill: '#CE93D8' }));
      break;
    case 'rumah':
      sky = '#FFF3E0';
      wall = 'repeating-linear-gradient(90deg, #FFF3E0 0 30px, #FFE8CC 30px 60px)';
      top.push(s('rect', { x: 760, y: 20, width: 170, height: 120, rx: 8, fill: '#BBDEFB' }), s('path', { d: 'M845 20 V140 M760 80 H930', stroke: '#A0673D', 'stroke-width': 10 }), s('rect', { x: 760, y: 20, width: 170, height: 120, rx: 8, fill: 'none', stroke: '#A0673D', 'stroke-width': 12 }));
      top.push(s('rect', { x: 70, y: 30, width: 110, height: 84, rx: 6, fill: '#FFCC80', stroke: '#8D6E63', 'stroke-width': 8 }), flower(125, 74, '#FF8FB1', 10));
      bottom.push(s('rect', { x: 0, y: 470, width: 1000, height: 130, fill: '#D7A36B' }));
      for (let x = 0; x < 1000; x += 125) bottom.push(s('path', { d: `M${x} 470 V600`, stroke: '#C68B52', 'stroke-width': 4 }));
      bottom.push(s('ellipse', { cx: 500, cy: 560, rx: 300, ry: 34, fill: '#F48FB1' }), s('ellipse', { cx: 500, cy: 560, rx: 250, ry: 24, fill: 'none', stroke: '#fff', 'stroke-width': 4, 'stroke-dasharray': '10 10' }));
      break;
    case 'musik': {
      sky = '#E8EAF6';
      let val = 'M0 0 H1000 V40';
      for (let x = 1000; x > 0; x -= 50) val += ` Q${x - 25} 80 ${x - 50} 40`;
      top.push(s('path', { d: 'M0 0 H140 Q110 90 40 160 H0 Z', fill: '#E53935' }), s('path', { d: 'M1000 0 H860 Q890 90 960 160 H1000 Z', fill: '#E53935' }));
      top.push(s('path', { d: `${val} Z`, fill: '#C62828' }));
      for (let i = 0; i < 6; i++) top.push(s('text', { x: 230 + i * 110, y: 110 + (i % 2) * 30, 'font-size': 36, fill: '#9FA8DA' }, ['♪']));
      bottom.push(s('rect', { x: 0, y: 500, width: 1000, height: 100, fill: '#A1887F' }), s('rect', { x: 0, y: 500, width: 1000, height: 14, fill: '#8D6E63' }));
      bottom.push(s('path', { d: 'M0 440 H40 Q70 470 90 500 H0 Z M1000 440 H960 Q930 470 910 500 H1000 Z', fill: '#E53935' }));
      break;
    }
    case 'hewan':
      sky = '#E8F5E9';
      top.push(cloud(140, 80), cloud(700, 60, 0.8), s('circle', { cx: 930, cy: 50, r: 40, fill: '#FFE082' }));
      bottom.push(s('path', { d: hill(490, [[240, 60], [560, 40], [880, 70], [1000, 40]]), fill: '#C5E1A5' }));
      for (let x = 20; x < 1000; x += 70) bottom.push(s('path', { d: `M${x} 540 V478 l12 -12 l12 12 V540 Z`, fill: '#FFE0B2' }));
      bottom.push(s('rect', { x: 0, y: 492, width: 1000, height: 12, fill: '#D7A36B' }), s('rect', { x: 0, y: 518, width: 1000, height: 12, fill: '#D7A36B' }));
      bottom.push(s('path', { d: hill(560, [[300, 30], [700, 40], [1000, 30]]), fill: '#9CCC65' }));
      for (const x of [110, 880]) bottom.push(s('rect', { x, y: 520, width: 90, height: 56, rx: 14, fill: '#FFCA28' }), s('path', { d: `M${x + 10} 536 H${x + 80} M${x + 10} 556 H${x + 80}`, stroke: '#F9A825', 'stroke-width': 4 }));
      break;
  }
  const band = (cls: string, viewBox: string, align: string, layers: SVGElement[], id: string) =>
    s('svg', { class: `backdrop-band ${cls}`, viewBox, preserveAspectRatio: `${align} slice`, 'aria-hidden': 'true' }, [
      s('defs', {}, [
        s('filter', { id, x: '-5%', y: '-10%', width: '110%', height: '130%' }, [
          s('feDropShadow', { dx: 0, dy: 4, stdDeviation: 2.5, 'flood-color': '#5D4037', 'flood-opacity': 0.25 }),
        ]),
      ]),
      s('g', { filter: `url(#${id})` }, layers),
    ]);
  const el = document.createElement('div');
  el.className = 'backdrop';
  el.style.background = wall ? `${wall}, ${sky}` : sky;
  el.append(band('band-top', '0 0 1000 160', 'xMidYMin', top, 'cut-top'), band('band-bottom', '0 440 1000 160', 'xMidYMax', bottom, 'cut-bottom'));
  return el;
}
