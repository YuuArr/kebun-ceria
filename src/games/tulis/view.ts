import { earIcon } from '../../art/areas';
import { h, s } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { type Stroke } from '../../content/strokes';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { createTracer, makeTraceRound } from './logic';
import { STROKES } from '../../content/strokes';
import type { Letter } from '../../content/letters';
import { getSeen, markSeen } from '../../core/seen';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const COLORS = ['#E53935', '#1E88E5', '#43A047', '#FFA94D', '#AB47BC'];
const pathD = (st: Stroke) => st.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

export interface TraceConfig {
  /** Glyphs to trace this round (letters or digits). */
  items: string[];
  strokes: (item: string) => Stroke[];
  /** "Ayo kita tulis…" */
  introLine: string;
  nameLine: (item: string) => string;
  /** Spoken after the name when finished (e.g. the letter sound). */
  afterLine?: (item: string) => string;
}

/** Trace glyphs with a finger, stroke by stroke, starting at the green dot. Shared by letters and digits. */
export function runTrace(ctx: GameContext, cfg: TraceConfig): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const letters = cfg.items;
  const svg = s('svg', { viewBox: '-12 -12 124 164', class: 'trace-board', 'data-testid': 'trace-board' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  const dots = h('div', { class: 'card-dots' }, letters.map(() => h('span')));
  let current = letters[0];
  ear.addEventListener('click', () => void (async () => {
    await audio.play(cfg.introLine);
    await audio.play(cfg.nameLine(current));
  })());
  root.append(h('div', { class: 'tulis-layout' }, [svg, dots]), h('div', { class: 'corner-tr' }, [ear]));

  const traceLetter = (letter: string, index: number) =>
    new Promise<void>((resolve) => {
      current = letter;
      dots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('on', i <= index));
      const strokes = cfg.strokes(letter);
      const tracer = createTracer(strokes);
      const color = COLORS[index % COLORS.length];
      svg.dataset.strokes = JSON.stringify(strokes);
      svg.dataset.letter = letter;
      const guide = s('g', { class: 'trace-guide' }, strokes.map((st) => s('path', { d: pathD(st) })));
      const dashes = s('g', { class: 'trace-dashes' }, strokes.map((st) => s('path', { d: pathD(st) })));
      const done = s('g', { class: 'trace-done', stroke: color });
      const trail = s('polyline', { class: 'trace-trail', points: '', stroke: color });
      const start = s('g', { class: 'trace-start' });
      svg.replaceChildren(guide, dashes, done, trail, start);
      const showStart = () => {
        const i = tracer.activeStroke();
        start.replaceChildren();
        if (i >= strokes.length) return;
        const [x, y] = strokes[i][0];
        start.append(s('circle', { cx: x, cy: y, r: 8 }), s('text', { x, y: y + 4, 'text-anchor': 'middle' }, [String(i + 1)]));
      };
      showStart();

      let finished = false;
      let pts: string[] = [];
      let pointer: number | null = null;
      let last: readonly [number, number] | null = null;
      const toBox = (e: PointerEvent) => {
        const m = svg.getScreenCTM();
        if (!m) return null;
        const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
        return [p.x, p.y] as const;
      };
      const onTouch = (e: PointerEvent) => {
        if (finished || !alive || e.pointerId !== pointer) return;
        // Fast fingers: the browser merges moves, so use every merged sample and fill the gaps.
        const samples = typeof e.getCoalescedEvents === 'function' && e.type === 'pointermove' ? e.getCoalescedEvents() : [];
        for (const ev of samples.length ? samples : [e]) {
          const p = toBox(ev);
          if (!p) continue;
          const from = last ?? p;
          const n = Math.max(1, Math.ceil(Math.hypot(p[0] - from[0], p[1] - from[1]) / 3));
          for (let k = 1; k <= n && !finished; k++) touchAt(from[0] + ((p[0] - from[0]) * k) / n, from[1] + ((p[1] - from[1]) * k) / n);
          last = p;
          pts.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`);
        }
        trail.setAttribute('points', pts.join(' '));
      };
      const touchAt = (x: number, y: number) => {
        const r = tracer.touch(x, y);
        if (r.strokeDone) {
          done.append(s('path', { d: pathD(strokes[r.stroke]) }));
          audio.sfx('pop');
          pts = [];
          last = null;
          trail.setAttribute('points', '');
          showStart();
        }
        if (r.letterDone) {
          finished = true;
          svg.classList.add('letter-done');
          const b = svg.getBoundingClientRect();
          celebrate.stars({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
          void (async () => {
            await audio.play(cfg.nameLine(letter));
            if (cfg.afterLine) await audio.play(cfg.afterLine(letter));
            await audio.play(rng.pick(PRAISE_IDS));
            await wait(500);
            svg.classList.remove('letter-done');
            resolve();
          })();
        }
      };
      svg.onpointerdown = (e) => {
        if (pointer !== null) return;
        pointer = e.pointerId;
        try { svg.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
        pts = [];
        last = null;
        onTouch(e);
      };
      svg.onpointermove = onTouch;
      svg.onpointerup = svg.onpointercancel = (e) => {
        if (e.pointerId !== pointer) return;
        pointer = null;
        pts = [];
        last = null;
        trail.setAttribute('points', '');
      };
      void (async () => {
        await audio.play(cfg.introLine);
        if (!alive) return;
        await audio.play(cfg.nameLine(letter));
        if (index === 0 && alive) await audio.play('tulis_ikuti');
      })();
    });

  void (async () => {
    for (let i = 0; i < letters.length; i++) {
      if (!alive) return;
      await traceLetter(letters[i], i);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
  };
}

/** Menulis Huruf. */
export function startTulis(ctx: GameContext): () => void {
  const items = makeTraceRound(ctx.settings.age, ctx.rng, ctx.level, { all: ctx.settings.letters === 'semua', seen: getSeen('tulis') });
  markSeen('tulis', items);
  return runTrace(ctx, {
    items,
    strokes: (l) => STROKES[l as Letter],
    introLine: 'tulis_ajak',
    nameLine: (l) => `huruf_nama_${l.toLowerCase()}`,
    afterLine: (l) => `huruf_bunyi_${l.toLowerCase()}`,
  });
}
