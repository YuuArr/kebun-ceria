import { earIcon, mindIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { getSeen, markSeen } from '../../core/seen';
import { onTap } from '../../core/tap';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { createMemory, makeMemoryDeck } from './logic';

/** Cari Pasangan: flip two cards; find all matching pairs. */
export function startMemori(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const deck = makeMemoryDeck(ctx.settings.age, rng, ctx.level, getSeen('memori'));
  markSeen('memori', [...new Set(deck)]);
  const game = createMemory(deck);
  let busy = false;
  const cols = deck.length <= 4 ? 2 : deck.length <= 6 ? 3 : 4;
  const grid = h('div', { class: 'memory-grid', style: `--cols:${cols};--rows:${Math.ceil(deck.length / cols)}`, 'data-testid': 'memory-grid' });
  const cards = deck.map((art, i) => {
    const card = h('button', { class: 'memory-card', type: 'button', 'data-art': art, 'data-index': i, 'data-testid': 'memory-card', 'aria-label': 'kartu' }, [
      h('div', { class: 'memory-back' }, [mindIcon()]),
      h('div', { class: 'memory-front' }, [thing(art)]),
    ]);
    onTap(card, async () => {
      if (busy || !alive) return;
      const r = game.flip(i);
      if (r.kind === 'ignored') return;
      card.classList.add('open');
      audio.sfx('tap');
      if (r.kind === 'first') return;
      if (r.kind === 'miss') {
        busy = true;
        await wait(900);
        r.pair.forEach((k) => cards[k].classList.remove('open'));
        audio.sfx('boing');
        busy = false;
        return;
      }
      r.pair.forEach((k) => cards[k].classList.add('matched'));
      const b = card.getBoundingClientRect();
      celebrate.stars({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
      audio.sfx('chime');
      if (r.done) {
        busy = true;
        await audio.play(rng.pick(PRAISE_IDS));
        await wait(500);
        if (alive) ctx.finishRound();
      }
    });
    return card;
  });
  grid.append(...cards);
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('memori_ajak'));
  root.append(h('div', { class: 'memory-layout' }, [grid]), h('div', { class: 'corner-tr' }, [ear]));
  void audio.play('memori_ajak');
  return () => { alive = false; };
}
