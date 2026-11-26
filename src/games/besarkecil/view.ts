import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { getSeen, markSeen } from '../../core/seen';
import { PRAISE_IDS } from '../../content/lines';
import type { Letter } from '../../content/letters';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { makeCaseRound } from './logic';

/** Huruf Besar-Kecil: drag each small letter onto its capital. */
export function startBesarKecil(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const steps = makeCaseRound(ctx.settings.age, rng, ctx.level, { all: ctx.settings.letters === 'semua', seen: getSeen('besarkecil') });
  markSeen('besarkecil', steps.flat());
  const boxes = h('div', { class: 'letter-boxes' });
  const tray = h('div', { class: 'picture-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('besarkecil_ajak'));
  root.append(h('div', { class: 'awal-layout' }, [boxes, tray]), h('div', { class: 'corner-tr' }, [ear]));

  const runStep = (letters: Letter[]) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((c) => c());
      cleanups = [];
      const boxEls = letters.map((l) => h('div', { class: 'letter-box', 'data-letter': l, 'data-testid': `box-${l}` }, [h('span', {}, [l])]));
      boxes.replaceChildren(...boxEls);
      tray.replaceChildren();
      let done = 0;
      for (const l of rng.shuffle(letters)) {
        const tile = h('div', { class: 'lower-tile', 'data-letter': l, 'data-testid': 'lower-tile' }, [l.toLowerCase()]);
        tray.append(tile);
        cleanups.push(makeDraggable(tile, {
          targets: () => boxEls.filter((b) => !b.classList.contains('filled')),
          onStart: () => void audio.play(`huruf_nama_${l.toLowerCase()}`),
          onReject: () => audio.sfx('boing'),
          onDrop: (t) => {
            if (!alive || (t as HTMLElement).dataset.letter !== l) return false;
            t.classList.add('filled');
            t.append(h('small', {}, [l.toLowerCase()]));
            tile.classList.add('used');
            const r = t.getBoundingClientRect();
            celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            audio.sfx('pop');
            done++;
            void (async () => {
              await audio.play(`huruf_nama_${l.toLowerCase()}`);
              if (done === letters.length && alive) {
                await audio.play(rng.pick(PRAISE_IDS));
                await wait(500);
                resolve();
              }
            })();
            return true;
          },
        }));
      }
    });

  void (async () => {
    await audio.play('besarkecil_ajak');
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
