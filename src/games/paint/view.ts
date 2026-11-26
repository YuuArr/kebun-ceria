import { earIcon } from '../../art/areas';
import { COLOR_SHAPE as SHAPE, HEX } from '../../art/colors';
import { SKETCHES } from '../../art/sketches';
import { h, s, svgRoot } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { onTap } from '../../core/tap';
import { COLORS, type ColorId } from '../../content/lines';

export { HEX };
import type { GameContext } from '../types';
import { createPaintState } from './logic';

function bucket(color: ColorId): SVGSVGElement {
  const o = { stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' } as const;
  return svgRoot('0 0 100 100', [
    s('path', { d: 'M22 30 H78 L70 90 H30 Z', fill: HEX[color], ...o }),
    s('ellipse', { cx: 50, cy: 30, rx: 28, ry: 8, fill: HEX[color], ...o }),
    s('path', { d: 'M22 30 Q50 -6 78 30', fill: 'none', ...o }),
    s('g', { transform: 'translate(0 26)' }, [s('path', { d: SHAPE[color], fill: '#fff', stroke: '#fff', 'stroke-width': 2, 'stroke-linejoin': 'round' })]),
  ]);
}

let lastSketch = '';

/** Kuas Ajaib Warna: pick a bucket, tap any part of the picture to fill it. No wrong colours. */
export function startPaint(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let done = false;
  const sketch = rng.pick(SKETCHES.filter((sk) => sk.id !== lastSketch));
  lastSketch = sketch.id;
  const state = createPaintState(sketch);

  const regions = sketch.regions.map((r) => {
    const p = s('path', { d: r.d, class: 'paint-region', fill: '#fff', 'data-region': r.id, 'data-testid': 'paint-region' });
    onTap(p, (e) => {
      if (!alive || done) return;
      const color = state.selected();
      const res = state.fill(r.id);
      if (res.changed) {
        p.setAttribute('fill', HEX[color]);
        p.dataset.color = color;
        const pe = e as PointerEvent;
        const box = p.getBoundingClientRect();
        const at = pe.clientX ? { x: pe.clientX, y: pe.clientY } : { x: box.left + box.width / 2, y: box.top + box.height / 2 };
        celebrate.splash(at, HEX[color]);
        audio.sfx('splash');
      }
      if (res.complete && !done) {
        done = true;
        void (async () => {
          await new Promise((r) => setTimeout(r, 400));
          await audio.play('kuas_selesai');
          if (alive) ctx.finishRound();
        })();
      }
    });
    return p;
  });
  const picture = svgRoot('-12 -12 424 324', [
    s('g', { class: 'paint-regions' }, regions),
    s('path', { d: sketch.outline, class: 'paint-lines' }),
  ], { class: 'paint-picture', 'data-sketch': sketch.id, preserveAspectRatio: 'xMidYMid meet' });

  const buckets = COLORS.map((color) => {
    const b = h('button', { class: 'bucket', type: 'button', 'aria-label': color, 'aria-pressed': String(color === 'merah'), 'data-testid': `bucket-${color}` }, [bucket(color)]);
    b.addEventListener('click', () => {
      state.select(color);
      buckets.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      audio.sfx('tap');
      void audio.play(`warna_${color}`);
    });
    return b;
  });

  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('kuas_ajak'));

  root.append(
    h('div', { class: 'paint-layout' }, [h('div', { class: 'paint-canvas' }, [picture]), h('div', { class: 'bucket-row' }, buckets)]),
    h('div', { class: 'corner-tr' }, [ear]),
  );
  void audio.play('kuas_ajak');
  return () => {
    alive = false;
  };
}
