import { earIcon } from '../../art/areas';
import { cici } from '../../art/cici';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { makePathRound, type Crossing } from './logic';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Sungai Angka: put the missing number stone back so Cici can hop across, counting. */
export function startSungai(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const crossings = makePathRound(ctx.settings.age, rng, ctx.level);
  const river = h('div', { class: 'river' });
  const path = h('div', { class: 'stone-path' });
  const rabbit = h('div', { class: 'river-cici' }, [cici()]);
  const tray = h('div', { class: 'stone-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('sungai_ajak'));
  root.append(h('div', { class: 'sungai-layout' }, [h('div', { class: 'river-wrap' }, [river, path, rabbit]), tray]), h('div', { class: 'corner-tr' }, [ear]));

  const hopTo = async (el: Element | null) => {
    const stage = river.parentElement!.getBoundingClientRect();
    if (!el) {
      rabbit.style.translate = '';
      return;
    }
    const r = el.getBoundingClientRect();
    rabbit.style.translate = `${r.left + r.width / 2 - stage.left - rabbit.offsetWidth / 2}px ${r.top - stage.top - rabbit.offsetHeight * 0.8}px`;
    await wait(420);
  };

  const cross = (c: Crossing) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((f) => f());
      cleanups = [];
      rabbit.classList.remove('across');
      rabbit.style.translate = '';
      const stones = c.stones.map((n) =>
        n === c.missing
          ? h('div', { class: 'stone gap', 'data-n': n, 'data-testid': 'stone-gap' })
          : h('div', { class: 'stone', 'data-n': n }, [h('span', {}, [String(n)])]),
      );
      path.replaceChildren(...stones);
      const gap = stones[c.stones.indexOf(c.missing)];
      tray.replaceChildren();
      for (const n of c.choices) {
        const el = h('div', { class: 'stone choice', 'data-n': n, 'data-testid': 'stone-choice' }, [h('span', {}, [String(n)])]);
        tray.append(el);
        cleanups.push(
          makeDraggable(el, {
            targets: () => [gap],
            onStart: () => void audio.play(`angka_${n}`),
            onReject: () => audio.sfx('boing'),
            onDrop: () => {
              if (!alive || n !== c.missing) return false;
              audio.sfx('pop');
              gap.classList.remove('gap');
              gap.classList.add('filled');
              gap.append(h('span', {}, [String(n)]));
              setTimeout(() => el.classList.add('used'), 100);
              void (async () => {
                await wait(300);
                for (const st of stones) {
                  if (!alive) return;
                  rabbit.classList.add('hopping');
                  await hopTo(st);
                  await audio.play(`angka_${st.dataset.n}`);
                }
                rabbit.classList.add('across');
                await hopTo(null);
                const r = river.getBoundingClientRect();
                celebrate.stars({ x: r.right - 60, y: r.top + r.height / 2 });
                await audio.play(rng.pick(PRAISE_IDS));
                rabbit.classList.remove('hopping');
                await wait(400);
                resolve();
              })();
              return true;
            },
          }),
        );
      }
      void audio.play('sungai_ajak');
    });

  void (async () => {
    for (const c of crossings) {
      if (!alive) return;
      await cross(c);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
    cleanups.forEach((f) => f());
  };
}
