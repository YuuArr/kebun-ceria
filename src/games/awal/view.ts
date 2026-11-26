import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { getSeen, markSeen } from '../../core/seen';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { makeInitialRound, type InitialStep } from './logic';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Cocokkan Huruf Awal: drag each picture to the box with its first letter. */
export function startAwal(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const steps = makeInitialRound(ctx.settings.age, rng, ctx.level, { all: ctx.settings.letters === 'semua', seen: getSeen('awal') });
  markSeen('awal', steps.flatMap((s) => s.letters));
  const boxes = h('div', { class: 'letter-boxes' });
  const tray = h('div', { class: 'picture-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('awal_ajak'));
  root.append(h('div', { class: 'awal-layout' }, [boxes, tray]), h('div', { class: 'corner-tr' }, [ear]));

  const runStep = (step: InitialStep) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((c) => c());
      cleanups = [];
      const boxEls = step.letters.map((l) =>
        h('div', { class: 'letter-box', 'data-letter': l, 'data-testid': `box-${l}` }, [h('span', {}, [l])]),
      );
      boxes.replaceChildren(...boxEls);
      tray.replaceChildren();
      let done = 0;
      for (const w of step.pictures) {
        const el = h('div', { class: 'picture-card', 'data-letter': w.letter, 'data-testid': 'picture-card', 'aria-label': w.word }, [thing(w.art)]);
        tray.append(el);
        cleanups.push(
          makeDraggable(el, {
            targets: () => boxEls,
            onStart: () => void audio.play(`kata_${w.word}`),
            onReject: () => audio.sfx('boing'),
            onDrop: (t) => {
              if (!alive || (t as HTMLElement).dataset.letter !== w.letter) return false;
              audio.sfx('pop');
              t.classList.add('filled');
              const r = t.getBoundingClientRect();
              celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
              done++;
              void (async () => {
                await audio.play(`huruf_bunyi_${w.letter.toLowerCase()}`);
                await audio.play('kata_untuk');
                await audio.play(`kata_${w.word}`);
                if (done === step.pictures.length && alive) {
                  await audio.play(rng.pick(PRAISE_IDS));
                  await wait(600);
                  resolve();
                }
              })();
              return true;
            },
          }),
        );
      }
    });

  void (async () => {
    await audio.play('awal_ajak');
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
