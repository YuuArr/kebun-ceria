import { earIcon } from '../../art/areas';
import { basket } from '../../art/colors';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { makeSortRound } from './logic';

/** Sortir Keranjang Warna: drag each thing into the basket of the same colour. */
export function startSortir(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const round = makeSortRound(ctx.settings.age, rng, ctx.level);
  const baskets = round.colors.map((c) => h('div', { class: 'sort-basket', 'data-color': c, 'data-testid': `basket-${c}`, 'aria-label': c }, [basket(c)]));
  const tray = h('div', { class: 'sort-tray' });
  let sorted = 0;
  const cleanups = round.items.map((it) => {
    const el = h('div', { class: 'sort-item', 'data-color': it.color, 'data-testid': 'sort-item' }, [thing(it.art)]);
    tray.append(el);
    return makeDraggable(el, {
      targets: () => baskets,
      onStart: () => audio.sfx('tap'),
      onReject: () => audio.sfx('boing'),
      onDrop: (t) => {
        if (!alive || (t as HTMLElement).dataset.color !== it.color) return false;
        audio.sfx('pop');
        const r = t.getBoundingClientRect();
        celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 3 });
        setTimeout(() => el.classList.add('in-basket'), 150);
        sorted++;
        void (async () => {
          await audio.play(`warna_${it.color}`);
          if (sorted === round.items.length && alive) {
            await audio.play(rng.pick(PRAISE_IDS));
            ctx.finishRound();
          }
        })();
        return true;
      },
    });
  });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('sortir_ajak'));
  root.append(h('div', { class: 'sort-layout' }, [h('div', { class: 'sort-baskets' }, baskets), tray]), h('div', { class: 'corner-tr' }, [ear]));
  void audio.play('sortir_ajak');
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
