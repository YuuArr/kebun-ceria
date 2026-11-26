import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { getSeen, markSeen } from '../../core/seen';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { makeBuildRound, type BuildQ } from './logic';

/** Susun Suku Kata: build the word from syllable tiles, in order (BO + LA = BOLA). */
export function startSusun(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const qs = makeBuildRound(ctx.settings.age, rng, ctx.level, getSeen('susun'));
  markSeen('susun', qs.map((q) => q.word.word));
  const pic = h('div', { class: 'susun-pic' });
  const slots = h('div', { class: 'syllable-slots' });
  const tray = h('div', { class: 'syllable-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  let current: BuildQ | null = null;
  ear.addEventListener('click', () => void (async () => {
    await audio.play('susun_ajak');
    if (current) await audio.play(current.word.line);
  })());
  root.append(h('div', { class: 'susun-layout' }, [pic, slots, tray]), h('div', { class: 'corner-tr' }, [ear]));

  const build = (q: BuildQ) =>
    new Promise<void>((resolve) => {
      current = q;
      cleanups.forEach((c) => c());
      cleanups = [];
      pic.replaceChildren(thing(q.word.art));
      const slotEls = q.word.parts.map((p, i) => h('div', { class: 'syllable-slot', 'data-index': i, 'data-part': p, 'data-testid': `syl-slot-${i}` }));
      slots.replaceChildren(...slotEls);
      tray.replaceChildren();
      let next = 0;
      for (const t of q.tiles) {
        const tile = h('div', { class: 'syllable-tile', 'data-part': t, 'data-testid': 'syllable-tile' }, [t]);
        tray.append(tile);
        cleanups.push(makeDraggable(tile, {
          // Only the next empty slot accepts, so the word is built left to right.
          targets: () => slotEls.filter((_, i) => i === next),
          onStart: () => void audio.play(`suku_${t.toLowerCase()}`),
          onReject: () => audio.sfx('boing'),
          onDrop: (target) => {
            if (!alive || (target as HTMLElement).dataset.part !== t) return false;
            target.classList.add('filled');
            target.textContent = t;
            tile.classList.add('used');
            audio.sfx('pop');
            next++;
            if (next === q.word.parts.length) {
              void (async () => {
                slots.classList.add('complete');
                const r = slots.getBoundingClientRect();
                celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
                await audio.play(`suku_${t.toLowerCase()}`);
                await audio.play(q.word.line);
                await audio.play(rng.pick(PRAISE_IDS));
                await wait(500);
                slots.classList.remove('complete');
                resolve();
              })();
            } else {
              void audio.play(`suku_${t.toLowerCase()}`);
            }
            return true;
          },
        }));
      }
      void (async () => {
        await audio.play('susun_ajak');
        if (alive) await audio.play(q.word.line);
      })();
    });

  void (async () => {
    for (const q of qs) {
      if (!alive) return;
      await build(q);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
