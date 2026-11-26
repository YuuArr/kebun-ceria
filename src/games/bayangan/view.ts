import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { getSeen, markSeen } from '../../core/seen';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { choiceButtons, wait } from '../shared/choice';
import { makeShadowRound, type ShadowQ } from './logic';

/** Cari Bayangan: find the silhouette that matches the object. */
export function startBayangan(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const qs = makeShadowRound(ctx.settings.age, rng, ctx.level, getSeen('bayangan'));
  markSeen('bayangan', qs.map((q) => q.art));
  const subject = h('div', { class: 'shadow-subject', 'data-testid': 'shadow-subject' });
  const opts = h('div', { class: 'choice-row' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('bayangan_ajak'));
  root.append(h('div', { class: 'bayangan-layout' }, [subject, opts]), h('div', { class: 'corner-tr' }, [ear]));

  const ask = (q: ShadowQ) =>
    new Promise<void>((resolve) => {
      subject.replaceChildren(thing(q.art));
      opts.replaceChildren(...choiceButtons(q.options, {
        audio,
        className: 'shadow-choice',
        render: (a) => thing(a),
        isRight: (a) => a === q.art,
        onRight: async (el) => {
          el.classList.add('revealed');
          await audio.play(rng.pick(PRAISE_IDS));
          await wait(500);
          resolve();
        },
      }));
      void audio.play('bayangan_ajak');
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
