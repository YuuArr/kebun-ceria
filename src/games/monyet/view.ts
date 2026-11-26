import { earIcon } from '../../art/areas';
import { monyet } from '../../art/monyet';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { createFeeder, makeFeedRound } from './logic';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Kasih Makan Monyet: drag exactly as many bananas as the monkey wants. */
export function startMonyet(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const cleanups: (() => void)[] = [];
  const rounds = makeFeedRound(ctx.settings.age, rng);

  const monkey = h('div', { class: 'monyet-wrap' }, [monyet()]);
  const mouth = h('div', { class: 'monyet-mouth-target drop-target', 'data-testid': 'monyet-mouth' });
  monkey.append(mouth);
  const bubble = h('div', { class: 'thought', 'data-testid': 'monyet-bubble' });
  const basket = h('div', { class: 'banana-basket', 'data-testid': 'banana-basket' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  let prompt = 'monyet_ajak_1';
  ear.addEventListener('click', () => void audio.play(prompt));
  root.append(h('div', { class: 'monyet-layout' }, [h('div', { class: 'monyet-side' }, [bubble, monkey]), basket]), h('div', { class: 'corner-tr' }, [ear]));

  const react = (cls: string) => {
    monkey.classList.remove('chew', 'shake');
    void monkey.offsetWidth;
    monkey.classList.add(cls);
  };

  const feeding = (n: number) =>
    new Promise<void>((resolve) => {
      const feeder = createFeeder(n);
      prompt = `monyet_ajak_${n}`;
      bubble.replaceChildren(
        h('span', { class: 'thought-num' }, [String(n)]),
        h('span', { class: 'thought-dots' }, Array.from({ length: n }, () => h('span', { class: 'thought-banana' }, [thing('pisang')]))),
      );
      cleanups.splice(0).forEach((c) => c());
      basket.replaceChildren();
      for (let i = 0; i < n + 2; i++) {
        const b = h('div', { class: 'banana', 'data-testid': 'banana' }, [thing('pisang')]);
        basket.append(b);
        cleanups.push(
          makeDraggable(b, {
            targets: () => [mouth],
            onStart: () => audio.sfx('tap'),
            onReject: () => audio.sfx('boing'),
            onDrop: () => {
              if (!alive) return false;
              const r = feeder.feed();
              if (!r.accepted) {
                react('shake');
                void audio.play('monyet_sudah_kenyang');
                return false;
              }
              react('chew');
              audio.sfx('pop');
              setTimeout(() => b.classList.add('eaten'), 120);
              const box = mouth.getBoundingClientRect();
              celebrate.stars({ x: box.left + box.width / 2, y: box.top });
              if (!r.full) {
                void audio.play(`angka_${r.eaten}`);
              } else {
                void (async () => {
                  await audio.play(`angka_${r.eaten}`);
                  await audio.play('monyet_kenyang');
                  await audio.play(rng.pick(PRAISE_IDS));
                  await wait(900);
                  resolve();
                })();
              }
              return true;
            },
          }),
        );
      }
      void audio.play(prompt);
    });

  void (async () => {
    for (const n of rounds) {
      if (!alive) return;
      await feeding(n);
    }
    if (alive) ctx.finishRound();
  })();

  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
