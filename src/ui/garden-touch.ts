import { s } from '../art/svg';
import type { AudioService } from '../core/audio';
import { clampToZone, getPositions, setPosition } from '../core/garden-layout';

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
const DRAG_START_PX = 10;

const VOICE: Record<string, string> = { duck: 'suara_bebek', cat: 'suara_kucing', frog: 'suara_katak' };
const PLANTS = ['grass', 'flower', 'sunflower', 'mushroom', 'bush', 'berrybush', 'plant', 'pot'];
const TREES = ['tree', 'fruittree'];
const FLYERS = ['butterfly', 'bird', 'bee', 'sky', 'cloud', 'kite', 'rainbow'];
const ANIMALS = ['duck', 'cat', 'frog', 'chick', 'snail', 'ladybug', 'animal'];

const place = (el: SVGGElement, x: number, y: number) => {
  el.dataset.x = String(x);
  el.dataset.y = String(y);
  el.setAttribute('transform', `translate(${x} ${y}) scale(${el.dataset.scale ?? 1})`);
};

/** Back-to-front order follows the ground line (things lower on screen are in front). */
function resort(scene: SVGGElement) {
  const items = [...scene.querySelectorAll<SVGGElement>(':scope > .garden-item')];
  items.sort((a, b) => (a.dataset.zone === 'sky' ? -1 : 0) - (b.dataset.zone === 'sky' ? -1 : 0) || Number(a.dataset.y) - Number(b.dataset.y));
  for (const it of items) scene.append(it);
}

/** Puts things where the child left them this season. */
export function applyLayout(scene: SVGGElement, season: number): void {
  const pos = getPositions(season);
  for (const el of scene.querySelectorAll<SVGGElement>('.garden-item')) {
    const p = pos[el.dataset.key ?? ''];
    if (p) place(el, p[0], p[1]);
  }
  resort(scene);
}

function react(el: SVGGElement, audio: AudioService) {
  const kind = el.dataset.kind ?? '';
  const inner = el.querySelector<SVGGElement>('.garden-item-inner');
  if (!inner || inner.classList.contains('reacting')) return;
  const cls = TREES.includes(kind) ? 'react-shake' : FLYERS.includes(kind) || el.dataset.zone === 'sky' ? 'react-fly' : ANIMALS.includes(kind) ? 'react-hop' : PLANTS.includes(kind) ? 'react-sway' : 'react-wiggle';
  inner.classList.add('reacting', cls);
  setTimeout(() => inner.classList.remove('reacting', cls), 800);
  if (VOICE[kind]) void audio.play(VOICE[kind]);
  else if (ANIMALS.includes(kind)) audio.sfx('pop');
  else audio.tone(PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)] * (FLYERS.includes(kind) ? 1.5 : 1));
  if (kind === 'fruittree') {
    // a fruit drops and bounces
    const fruit = s('circle', { cx: (Math.random() - 0.5) * 50, cy: -70, r: 7, fill: '#E53935', stroke: '#4A3B3B', 'stroke-width': 2, class: 'falling-fruit' });
    inner.append(fruit);
    setTimeout(() => fruit.remove(), 900);
  }
}

/** Tap a garden thing to make it react; press and drag to move it (it stays in its own zone). */
export function enableGardenTouch(svg: SVGSVGElement, scene: SVGGElement, season: number, audio: AudioService): () => void {
  let active: { el: SVGGElement; pointer: number; sx: number; sy: number; ox: number; oy: number; dragging: boolean } | null = null;
  const toSvg = (x: number, y: number) => {
    const m = svg.getScreenCTM();
    if (!m) return { x, y };
    const p = new DOMPoint(x, y).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const down = (e: PointerEvent) => {
    if (active) return;
    const el = (e.target as Element).closest<SVGGElement>('.garden-item');
    if (!el || el.classList.contains('hidden-until-grow')) return;
    active = { el, pointer: e.pointerId, sx: e.clientX, sy: e.clientY, ox: Number(el.dataset.x), oy: Number(el.dataset.y), dragging: false };
    try { svg.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
  };
  const move = (e: PointerEvent) => {
    if (!active || e.pointerId !== active.pointer) return;
    if (!active.dragging && Math.hypot(e.clientX - active.sx, e.clientY - active.sy) < DRAG_START_PX) return;
    if (!active.dragging) {
      active.dragging = true;
      active.el.classList.add('moving');
      scene.append(active.el); // lift above the others
    }
    const a = toSvg(active.sx, active.sy);
    const b = toSvg(e.clientX, e.clientY);
    const [x, y] = clampToZone(active.el.dataset.zone === 'sky' ? 'sky' : 'ground', active.ox + b.x - a.x, active.oy + b.y - a.y);
    place(active.el, x, y);
  };
  const up = (e: PointerEvent) => {
    if (!active || e.pointerId !== active.pointer) return;
    const { el, dragging } = active;
    active = null;
    if (!dragging) {
      react(el, audio);
      return;
    }
    el.classList.remove('moving');
    setPosition(season, el.dataset.key ?? '', Number(el.dataset.x), Number(el.dataset.y));
    audio.sfx('tap');
    resort(scene);
  };
  svg.addEventListener('pointerdown', down);
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', up);
  svg.addEventListener('pointercancel', up);
  return () => {
    svg.removeEventListener('pointerdown', down);
    svg.removeEventListener('pointermove', move);
    svg.removeEventListener('pointerup', up);
    svg.removeEventListener('pointercancel', up);
  };
}
