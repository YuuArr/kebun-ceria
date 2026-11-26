import { h, s, svgRoot } from '../../art/svg';
import { thing, type ArtId } from '../../art/things';
import { onTap } from '../../core/tap';
import type { GameContext } from '../types';

const COLORS = ['#E53935', '#FFA94D', '#FDD835', '#43A047', '#1E88E5', '#8E24AA', '#FF8FB1', '#4A3B3B'];
const STICKERS: ArtId[] = ['bintang', 'hati', 'kupu', 'apel', 'bebek', 'balon', 'ikan', 'kucing'];

interface Line { color: string; size: number; pts: [number, number][] }
interface Stamp { art: ArtId; x: number; y: number }

/** Gambar Bebas: draw freely with a finger, add stickers, then tap the check mark. */
export function startGambar(ctx: GameContext): () => void {
  const { root, audio } = ctx;
  let alive = true;
  const lines: Line[] = [];
  const stamps: Stamp[] = [];
  let color = COLORS[0];
  let sticker: ArtId | null = null;
  const canvas = h('canvas', { class: 'draw-canvas', 'data-testid': 'draw-canvas' });
  const stickerLayer = h('div', { class: 'sticker-layer' });
  const paper = h('div', { class: 'draw-paper' }, [canvas, stickerLayer]);
  const g = canvas.getContext('2d');

  const resize = () => {
    const r = paper.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    redraw();
  };
  const redraw = () => {
    if (!g) return;
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (const l of lines) {
      g.strokeStyle = l.color;
      g.lineWidth = l.size * canvas.width;
      g.beginPath();
      l.pts.forEach(([x, y], i) => (i ? g.lineTo(x * canvas.width, y * canvas.height) : g.moveTo(x * canvas.width, y * canvas.height)));
      if (l.pts.length === 1) g.lineTo(l.pts[0][0] * canvas.width + 0.1, l.pts[0][1] * canvas.height);
      g.stroke();
    }
  };
  const norm = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };

  let current: Line | null = null;
  let pointer: number | null = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (pointer !== null) return;
    const p = norm(e);
    if (sticker) {
      stamps.push({ art: sticker, x: p[0], y: p[1] });
      const el = h('div', { class: 'sticker', style: `left:${p[0] * 100}%;top:${p[1] * 100}%` }, [thing(sticker)]);
      stickerLayer.append(el);
      audio.sfx('pop');
      done.classList.add('ready');
      return;
    }
    pointer = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
    current = { color, size: 0.018, pts: [p] };
    lines.push(current);
    redraw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointer || !current) return;
    const evs = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
    for (const ev of evs.length ? evs : [e]) current.pts.push(norm(ev));
    redraw();
    if (current.pts.length > 8) done.classList.add('ready');
  });
  const end = (e: PointerEvent) => {
    if (e.pointerId !== pointer) return;
    pointer = null;
    current = null;
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  const swatches = COLORS.map((c) => {
    const b = h('button', { class: 'swatch', type: 'button', style: `--c:${c}`, 'aria-label': 'warna', 'aria-pressed': String(c === color) });
    b.addEventListener('click', () => {
      color = c;
      sticker = null;
      audio.sfx('tap');
      [...swatches, ...stickerBtns].forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    });
    return b;
  });
  const stickerBtns = STICKERS.map((a) => {
    const b = h('button', { class: 'sticker-btn', type: 'button', 'aria-label': `stiker ${a}`, 'aria-pressed': 'false', 'data-testid': `sticker-${a}` }, [thing(a)]);
    b.addEventListener('click', () => {
      sticker = a;
      audio.sfx('tap');
      [...swatches, ...stickerBtns].forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    });
    return b;
  });
  const clear = h('button', { class: 'tool-btn', type: 'button', 'aria-label': 'Hapus semua', 'data-testid': 'draw-clear' }, [
    svgRoot('0 0 64 64', [s('path', { d: 'M18 20 H46 L42 54 H22 Z M14 20 H50 M26 14 H38', fill: '#fff', stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' })]),
  ]);
  const done = h('button', { class: 'tool-btn done-btn', type: 'button', 'aria-label': 'Selesai', 'data-testid': 'draw-done' }, [
    svgRoot('0 0 64 64', [s('path', { d: 'M14 34 L28 48 L52 18', fill: 'none', stroke: '#fff', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]),
  ]);
  // Clearing needs a long-ish press so a toddler does not wipe the picture by accident.
  let clearTimer: ReturnType<typeof setTimeout> | undefined;
  clear.addEventListener('pointerdown', () => {
    clearTimer = setTimeout(() => {
      lines.length = 0;
      stamps.length = 0;
      stickerLayer.replaceChildren();
      redraw();
      audio.sfx('splash');
    }, 700);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) clear.addEventListener(ev, () => clearTimeout(clearTimer));
  onTap(done, async () => {
    if (!done.classList.contains('ready') || !alive) return;
    done.classList.remove('ready');
    await audio.play('gambar_selesai');
    if (alive) ctx.finishRound();
  });

  root.append(h('div', { class: 'gambar-layout' }, [
    paper,
    h('div', { class: 'draw-tools' }, [h('div', { class: 'swatches' }, swatches), h('div', { class: 'stickers' }, stickerBtns), h('div', { class: 'tool-row' }, [clear, done])]),
  ]));
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  ro?.observe(paper);
  requestAnimationFrame(resize);
  void audio.play('gambar_ajak');
  return () => {
    alive = false;
    ro?.disconnect();
  };
}
