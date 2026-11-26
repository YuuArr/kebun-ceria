import { earIcon } from '../../art/areas';
import { h, s, svgRoot } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import type { Shape } from '../../content/lines';
import type { GameContext } from '../types';
import { BUILDS, createBuild, type Slot } from './logic';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Stretched shape for a slot or piece (rects fill their box, so one path serves square and rectangle). */
function piece(shape: Shape, fill: string, dashed = false): SVGSVGElement {
  const st = dashed
    ? { fill: 'rgba(255,255,255,.55)', stroke: '#8d7f7f', 'stroke-width': 3, 'stroke-dasharray': '8 6', 'vector-effect': 'non-scaling-stroke' }
    : { fill, stroke: '#4A3B3B', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' };
  const d =
    shape === 'lingkaran' ? 'M50 2 A48 48 0 1 1 49.9 2 Z' : shape === 'segitiga' ? 'M50 2 L98 98 H2 Z' : 'M2 2 H98 V98 H2 Z';
  return svgRoot('0 0 100 100', [s('path', { d, ...st, 'stroke-linejoin': 'round' })], { preserveAspectRatio: 'none' });
}

/** Rakit Roket: fit shapes into the outline; the finished build comes alive. */
export function startRakit(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const build = rng.pick(BUILDS);
  const state = createBuild(build);
  const area = h('div', { class: `build-area build-${build.id}`, 'data-testid': 'build-area' });
  const pct = (sl: Slot) => `left:${(sl.x / 400) * 100}%;top:${(sl.y / 300) * 100}%;width:${(sl.w / 400) * 100}%;height:${(sl.h / 300) * 100}%`;
  const slots = build.slots.map((sl) => {
    const el = h('div', { class: 'build-slot', style: pct(sl), 'data-slot': sl.id, 'data-shape': sl.shape, 'data-testid': `slot-${sl.id}` }, [piece(sl.shape, sl.color, true)]);
    area.append(el);
    return el;
  });
  const tray = h('div', { class: 'build-tray' });
  const ordered = rng.shuffle(build.slots);
  const cleanups = ordered.map((sl) => {
    const aspect = sl.w / sl.h;
    const el = h('div', { class: 'build-piece', 'data-shape': sl.shape, 'data-testid': 'build-piece' }, [piece(sl.shape, sl.color)]);
    el.style.aspectRatio = String(Math.min(2, Math.max(0.5, aspect)));
    tray.append(el);
    return makeDraggable(el, {
      targets: () => slots.filter((x) => !x.classList.contains('filled')),
      onStart: () => audio.sfx('tap'),
      onReject: () => audio.sfx('boing'),
      onDrop: (t) => {
        const target = t as HTMLElement;
        const slot = build.slots.find((x) => x.id === target.dataset.slot)!;
        const r = state.place(slot.id, sl.shape);
        if (!alive || !r.ok) return false;
        audio.sfx('pop');
        target.classList.add('filled');
        target.replaceChildren(piece(slot.shape, slot.color));
        el.classList.add('used');
        void audio.play(`bentuk_${sl.shape.replace('-', '_')}`);
        if (r.done) void finish();
        return true;
      },
    });
  });

  const finish = async () => {
    await wait(500);
    if (!alive) return;
    if (build.id === 'roket') {
      for (const n of [3, 2, 1]) {
        await audio.play(`angka_${n}`);
        if (!alive) return;
      }
      area.classList.add('launch');
      audio.sfx('chime');
      await audio.play('rakit_meluncur');
    } else {
      area.classList.add(build.id === 'kereta' ? 'drive' : 'glow');
      const r = area.getBoundingClientRect();
      celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      await audio.play('rakit_jadi');
    }
    await wait(800);
    if (alive) ctx.finishRound();
  };

  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('rakit_ajak'));
  root.append(h('div', { class: 'rakit-layout' }, [area, tray]), h('div', { class: 'corner-tr' }, [ear]));
  void audio.play('rakit_ajak');
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
