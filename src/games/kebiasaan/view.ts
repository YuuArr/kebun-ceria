import { earIcon } from '../../art/areas';
import { routineArt } from '../../art/routines';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { makeRoutineRound, type RoutineQ } from './logic';

/** Urutkan Kebiasaan: put the steps of a daily routine in order (1, 2, 3, …). */
export function startKebiasaan(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const qs = makeRoutineRound(ctx.settings.age, rng, ctx.level);
  const slotsRow = h('div', { class: 'routine-slots' });
  const tray = h('div', { class: 'routine-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  let prompt = '';
  ear.addEventListener('click', () => void audio.play(prompt));
  root.append(h('div', { class: 'routine-layout' }, [slotsRow, tray]), h('div', { class: 'corner-tr' }, [ear]));

  const run = (q: RoutineQ) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((c) => c());
      cleanups = [];
      prompt = `kebiasaan_${q.routine.id}`;
      const slots = q.steps.map((_, i) => h('div', { class: 'routine-slot', 'data-order': i, 'data-testid': `step-slot-${i}` }, [h('span', { class: 'step-no' }, [String(i + 1)])]));
      slotsRow.replaceChildren(...slots);
      tray.replaceChildren();
      let done = 0;
      q.steps.forEach((step, order) => {
        const lineId = `kebiasaan_${q.routine.id}_${q.routine.steps.indexOf(step) + 1}`;
        const card = h('div', { class: 'routine-card', 'data-order': order, 'data-testid': 'routine-card' }, [routineArt(step.art)]);
        tray.append(card);
        cleanups.push(makeDraggable(card, {
          targets: () => slots.filter((s) => !s.classList.contains('filled')),
          onStart: () => void audio.play(lineId),
          onReject: () => audio.sfx('boing'),
          onDrop: (t) => {
            if (!alive || Number((t as HTMLElement).dataset.order) !== order) return false;
            t.classList.add('filled');
            t.append(routineArt(step.art));
            card.classList.add('used');
            audio.sfx('pop');
            done++;
            void (async () => {
              await audio.play(lineId);
              if (done === q.steps.length && alive) {
                const r = slotsRow.getBoundingClientRect();
                celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
                await audio.play(rng.pick(PRAISE_IDS));
                await wait(600);
                resolve();
              }
            })();
            return true;
          },
        }));
      });
      // shuffle the tray order visually
      for (const c of rng.shuffle([...tray.children])) tray.append(c);
      void audio.play(prompt);
    });

  void (async () => {
    for (const q of qs) {
      if (!alive) return;
      await run(q);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
