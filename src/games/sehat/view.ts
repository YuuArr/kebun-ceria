import { earIcon } from '../../art/areas';
import { cici } from '../../art/cici';
import { routineArt } from '../../art/routines';
import { h, s, svgRoot } from '../../art/svg';
import { thing, type ArtId } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { HEALTHY, makePlateRound, type Plate } from './logic';

const art = (id: string) => (id === 'permen' || id === 'soda' ? routineArt(id) : thing(id as ArtId));

/** Makanan Sehat: give Cici healthy food; sweets bounce back softly. */
export function startSehat(ctx: GameContext): () => void {
  const { root, audio } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const plates = makePlateRound(ctx.settings.age, ctx.rng, ctx.level);
  const bunny = h('div', { class: 'sehat-cici' }, [cici('happy')]);
  const plateEl = h('div', { class: 'sehat-plate', 'data-testid': 'plate' }, [
    svgRoot('0 0 160 60', [s('ellipse', { cx: 80, cy: 30, rx: 76, ry: 26, fill: '#fff', stroke: '#4A3B3B', 'stroke-width': 4 }), s('ellipse', { cx: 80, cy: 30, rx: 52, ry: 16, fill: 'none', stroke: '#E0E0E0', 'stroke-width': 3 })]),
    h('div', { class: 'plate-food' }),
  ]);
  const tray = h('div', { class: 'sehat-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('sehat_ajak'));
  root.append(h('div', { class: 'sehat-layout' }, [h('div', { class: 'sehat-table' }, [bunny, plateEl]), tray]), h('div', { class: 'corner-tr' }, [ear]));
  const food = plateEl.querySelector('.plate-food')!;

  const serve = (p: Plate) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((c) => c());
      cleanups = [];
      food.replaceChildren();
      tray.replaceChildren();
      let placed = 0;
      for (const id of p.items) {
        const healthy = HEALTHY.includes(id);
        const el = h('div', { class: 'sehat-item', 'data-food': id, 'data-healthy': String(healthy), 'data-testid': 'food' }, [art(id)]);
        tray.append(el);
        cleanups.push(makeDraggable(el, {
          targets: () => [plateEl],
          onStart: () => audio.sfx('tap'),
          onReject: () => audio.sfx('boing'),
          onDrop: () => {
            if (!alive) return false;
            if (!healthy) {
              void audio.play('sehat_kurang');
              return false;
            }
            el.classList.add('used');
            food.append(h('div', { class: 'plate-item' }, [art(id)]));
            audio.sfx('pop');
            placed++;
            if (placed === p.need) {
              void (async () => {
                bunny.classList.remove('chew');
                void bunny.offsetWidth;
                bunny.classList.add('chew');
                const r = plateEl.getBoundingClientRect();
                celebrate.stars({ x: r.left + r.width / 2, y: r.top });
                await audio.play('sehat_nyam');
                await wait(500);
                resolve();
              })();
            }
            return true;
          },
        }));
      }
    });

  void (async () => {
    await audio.play('sehat_ajak');
    for (const p of plates) {
      if (!alive) return;
      await serve(p);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
