import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { makeOrderRound, type OrderStep } from './logic';

/** Urutkan Kecil-Besar: drag each one onto its step, smallest on the left. */
export function startUrutkan(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const steps = makeOrderRound(ctx.settings.age, rng, ctx.level);
  const stairs = h('div', { class: 'order-stairs' });
  const tray = h('div', { class: 'order-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('urutkan_ajak'));
  root.append(h('div', { class: 'order-layout' }, [stairs, tray]), h('div', { class: 'corner-tr' }, [ear]));
  const scale = (rank: number, n: number) => 0.4 + (0.6 * (rank - 1)) / (n - 1);

  const runStep = (st: OrderStep) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((c) => c());
      cleanups = [];
      const n = st.sizes.length;
      const slots = Array.from({ length: n }, (_, i) => h('div', { class: 'order-slot', 'data-rank': i + 1, 'data-testid': `rank-${i + 1}`, style: `--h:${20 + i * 12}%` }));
      stairs.replaceChildren(...slots);
      tray.replaceChildren();
      let done = 0;
      for (const rank of st.sizes) {
        const item = h('div', { class: 'order-item', 'data-rank': rank, 'data-testid': 'order-item' }, [thing(st.art)]);
        item.firstElementChild!.setAttribute('style', `transform: scale(${scale(rank, n)})`);
        tray.append(item);
        cleanups.push(makeDraggable(item, {
          targets: () => slots.filter((s) => !s.classList.contains('filled')),
          onStart: () => audio.sfx('tap'),
          onReject: () => audio.sfx('boing'),
          onDrop: (t) => {
            if (!alive || Number((t as HTMLElement).dataset.rank) !== rank) return false;
            t.classList.add('filled');
            const copy = thing(st.art);
            copy.setAttribute('style', `transform: scale(${scale(rank, n)}); transform-origin: 50% 100%`);
            t.append(copy);
            item.classList.add('used');
            audio.sfx('pop');
            done++;
            if (done === n) {
              void (async () => {
                const r = stairs.getBoundingClientRect();
                celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
                await audio.play(rng.pick(PRAISE_IDS));
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
    await audio.play('urutkan_ajak');
    for (const st of steps) {
      if (!alive) return;
      await runStep(st);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
