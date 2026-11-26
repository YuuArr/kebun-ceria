import { earIcon } from '../../art/areas';
import { thing } from '../../art/things';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { onTapOnce } from '../../core/tap';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { createCounter, makeCountRound, type CountQuestion } from './logic';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Sentuh & Hitung: tap each object once; the narrator counts along. */
export function startCount(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const questions = makeCountRound(ctx.settings.age, rng, ctx.level);
  const field = h('div', { class: 'count-field', 'data-testid': 'count-field' });
  const bigNumber = h('div', { class: 'count-big', 'aria-hidden': 'true', 'data-testid': 'count-big' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  let prompt = '';
  ear.addEventListener('click', () => void audio.play(prompt));
  root.append(field, bigNumber, h('div', { class: 'corner-tr' }, [ear]));

  const runQuestion = (q: CountQuestion) =>
    new Promise<void>((resolve) => {
      prompt = `hitung_ajak_${q.object}`;
      const counter = createCounter(q.n);
      field.replaceChildren();
      field.dataset.n = String(q.n);
      field.style.setProperty('--cols', String(q.n <= 4 ? q.n : Math.ceil(q.n / 2)));
      bigNumber.textContent = '';
      bigNumber.classList.remove('show');
      for (let i = 0; i < q.n; i++) {
        const badge = h('span', { class: 'count-badge' });
        const item = h('button', { class: 'count-item', type: 'button', 'aria-label': q.object, 'data-testid': 'count-item' }, [badge, thing(q.object)]);
        item.style.animationDelay = `${i * 80}ms`;
        onTapOnce(item, async () => {
          const r = counter.tap(i);
          if (!r.isNew || !alive) return;
          badge.textContent = String(r.counted);
          item.classList.add('counted');
          const box = item.getBoundingClientRect();
          celebrate.stars({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
          audio.sfx('pop');
          const said = audio.play(`angka_${r.counted}`);
          if (r.done) {
            field.classList.add('locked');
            await said;
            await wait(250);
            if (!alive) return;
            bigNumber.textContent = String(q.n);
            bigNumber.classList.add('show');
            await audio.play('hitung_semua');
            await audio.play(`angka_${q.n}`);
            await audio.play(rng.pick(PRAISE_IDS));
            await wait(900); // let the big number sink in before the next question
            field.classList.remove('locked');
            resolve();
          }
        });
        field.append(item);
      }
      void audio.play(prompt);
    });

  void (async () => {
    for (const q of questions) {
      if (!alive) return;
      await runQuestion(q);
    }
    if (alive) ctx.finishRound();
  })();

  return () => {
    alive = false;
  };
}
