import { cici } from '../../art/cici';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { xylophone } from '../shared/xylophone';
import { createEcho, makeRhythmRound } from './logic';

/** Tiru Ritme: Cici plays a short tune; the child plays it back. */
export function startRitme(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const round = makeRhythmRound(ctx.settings.age, rng, ctx.level);
  let listening = false;
  let onPress: (i: number) => void = () => {};
  const xylo = xylophone(audio, round.bars, (i) => { if (listening) onPress(i); });
  const bunny = h('div', { class: 'ritme-cici', 'data-testid': 'ritme-cici' }, [cici('happy')]);
  const dots = h('div', { class: 'card-dots ritme-dots' }, round.sequences.map(() => h('span')));
  root.append(h('div', { class: 'ritme-layout' }, [bunny, xylo.el]), dots);
  xylo.el.dataset.testid = 'xylophone';

  const playTune = async (seq: number[]) => {
    listening = false;
    xylo.el.classList.add('demo');
    bunny.classList.add('playing');
    await wait(400);
    for (const n of seq) {
      if (!alive) return;
      xylo.flash(n);
      await wait(650);
    }
    bunny.classList.remove('playing');
    xylo.el.classList.remove('demo');
  };

  const turn = (seq: number[], index: number) =>
    new Promise<void>((resolve) => {
      dots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('on', i <= index));
      const echo = createEcho(seq);
      xylo.el.dataset.sequence = seq.join(',');
      const listen = async (again: boolean) => {
        await audio.play(again ? 'ritme_ulang' : 'ritme_dengar');
        await playTune(seq);
        if (!alive) return;
        await audio.play('ritme_giliran');
        listening = true;
        xylo.el.classList.add('your-turn');
      };
      onPress = (i) => {
        const r = echo.press(i);
        if (!r.ok) {
          listening = false;
          xylo.el.classList.remove('your-turn');
          celebrate.bounce(xylo.el);
          audio.sfx('boing');
          void (async () => { await wait(500); await listen(true); })();
          return;
        }
        if (r.done) {
          listening = false;
          xylo.el.classList.remove('your-turn');
          void (async () => {
            const b = bunny.getBoundingClientRect();
            celebrate.stars({ x: b.left + b.width / 2, y: b.top });
            await wait(400);
            await audio.play(rng.pick(PRAISE_IDS));
            resolve();
          })();
        }
      };
      void listen(false);
    });

  void (async () => {
    for (let i = 0; i < round.sequences.length; i++) {
      if (!alive) return;
      await turn(round.sequences[i], i);
    }
    if (alive) ctx.finishRound();
  })();
  return () => { alive = false; };
}
