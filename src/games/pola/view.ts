import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { choiceButtons, wait } from '../shared/choice';
import { makePatternRound, type PatternQ } from './logic';

/** Pola Berulang: what comes next in the pattern? */
export function startPola(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const qs = makePatternRound(ctx.settings.age, rng, ctx.level);
  const row = h('div', { class: 'pattern-row', 'data-testid': 'pattern-row' });
  const opts = h('div', { class: 'choice-row' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('pola_ajak'));
  root.append(h('div', { class: 'pola-layout' }, [row, opts]), h('div', { class: 'corner-tr' }, [ear]));

  const ask = (q: PatternQ) =>
    new Promise<void>((resolve) => {
      const hole = h('div', { class: 'pattern-card hole' }, ['?']);
      row.replaceChildren(...q.shown.map((a) => h('div', { class: 'pattern-card' }, [thing(a)])), hole);
      opts.replaceChildren(
        ...choiceButtons(q.options, {
          audio,
          render: (a) => thing(a),
          isRight: (a) => a === q.answer,
          onRight: async () => {
            hole.classList.remove('hole');
            hole.replaceChildren(thing(q.answer));
            await audio.play(rng.pick(PRAISE_IDS));
            await wait(500);
            resolve();
          },
        }),
      );
      void audio.play('pola_ajak');
    });

  void (async () => {
    for (const q of qs) {
      if (!alive) return;
      await ask(q);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
  };
}
