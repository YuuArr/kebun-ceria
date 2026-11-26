import { earIcon } from '../../art/areas';
import { shapeSvg } from '../../art/shapes';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { makePostRound } from './logic';

/** Kotak Pos Bentuk: post everyday things through the hole with the same shape. */
export function startKotakPos(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const round = makePostRound(ctx.settings.age, rng, ctx.level);
  const holes = round.holes.map((sh) =>
    h('div', { class: 'post-hole', 'data-shape': sh, 'data-testid': `hole-${sh}` }, [shapeSvg(sh, '#3E2C2C', '#2A1E1E')]),
  );
  const box = h('div', { class: 'postbox', style: `--holes:${holes.length}` }, [h('div', { class: 'postbox-roof' }), h('div', { class: 'postbox-body' }, holes)]);
  const tray = h('div', { class: 'post-tray', style: `--cols:${round.items.length > 6 ? 4 : 3}` });
  let posted = 0;
  const cleanups = round.items.map((item) => {
    const el = h('div', { class: 'post-item', 'data-shape': item.shape, 'data-testid': 'post-item' }, [thing(item.art)]);
    tray.append(el);
    return makeDraggable(el, {
      targets: () => holes,
      onStart: () => audio.sfx('tap'),
      onReject: () => audio.sfx('boing'),
      onDrop: (t) => {
        if (!alive || (t as HTMLElement).dataset.shape !== item.shape) return false;
        audio.sfx('pop');
        const r = t.getBoundingClientRect();
        celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        setTimeout(() => el.classList.add('posted'), 150);
        posted++;
        void (async () => {
          await audio.play(`bentuk_${item.shape.replace('-', '_')}`);
          if (posted === round.items.length && alive) {
            await audio.play(rng.pick(PRAISE_IDS));
            ctx.finishRound();
          }
        })();
        return true;
      },
    });
  });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('pos_ajak'));
  root.append(h('div', { class: 'post-layout' }, [box, tray]), h('div', { class: 'corner-tr' }, [ear]));
  void audio.play('pos_ajak');
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
