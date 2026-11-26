import { earIcon } from '../../art/areas';
import { cici } from '../../art/cici';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { choiceButtons, wait } from '../shared/choice';
import { makeMissingRound, type MissingQ } from './logic';

/** Apa yang Hilang?: look at the things, Cici hides one, which one is gone? */
export function startHilang(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const qs = makeMissingRound(ctx.settings.age, rng, ctx.level);
  const shelf = h('div', { class: 'missing-shelf', 'data-testid': 'missing-shelf' });
  const curtain = h('div', { class: 'missing-curtain' }, [cici('cheer')]);
  const opts = h('div', { class: 'choice-row' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('hilang_tanya'));
  root.append(h('div', { class: 'missing-layout' }, [h('div', { class: 'missing-stage' }, [shelf, curtain]), opts]), h('div', { class: 'corner-tr' }, [ear]));

  const ask = (q: MissingQ) =>
    new Promise<void>((resolve) => {
      opts.replaceChildren();
      shelf.replaceChildren(...q.shown.map((a) => h('div', { class: 'missing-item', 'data-art': a }, [thing(a)])));
      void (async () => {
        await audio.play('hilang_lihat');
        await wait(ctx.settings.age === '2-3' ? 2200 : 1800);
        if (!alive) return;
        curtain.classList.add('closed');
        audio.sfx('boing');
        await wait(900);
        shelf.querySelector(`[data-art="${q.missing}"]`)?.classList.add('gone');
        curtain.classList.remove('closed');
        await wait(500);
        if (!alive) return;
        opts.replaceChildren(...choiceButtons(q.options, {
          audio,
          render: (a) => thing(a),
          isRight: (a) => a === q.missing,
          onRight: async () => {
            shelf.querySelector(`[data-art="${q.missing}"]`)?.classList.remove('gone');
            await audio.play(rng.pick(PRAISE_IDS));
            await wait(500);
            resolve();
          },
        }));
        void audio.play('hilang_tanya');
      })();
    });

  void (async () => {
    for (const q of qs) {
      if (!alive) return;
      await ask(q);
    }
    if (alive) ctx.finishRound();
  })();
  return () => { alive = false; };
}
