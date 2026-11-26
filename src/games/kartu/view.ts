import { earIcon } from '../../art/areas';
import { h, s, svgRoot } from '../../art/svg';
import { thing } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { onTap } from '../../core/tap';
import type { GameContext } from '../types';
import { makeCardDeck } from './logic';

/** Kartu Kata Berbicara: tap the picture to hear the word, tap the first letter to hear its sound. */
export function startKartu(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const deck = makeCardDeck(ctx.settings.age, rng);
  let index = 0;
  const card = h('div', { class: 'word-card' });
  const next = h('button', { class: 'next-button', type: 'button', 'aria-label': 'Kartu berikutnya', 'data-testid': 'card-next' }, [
    svgRoot('0 0 64 64', [s('path', { d: 'M22 14 L46 32 L22 50', fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]),
  ]);
  const dots = h('div', { class: 'card-dots' }, deck.map(() => h('span')));
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('kartu_ajak'));
  root.append(h('div', { class: 'kartu-layout' }, [card, next, dots]), h('div', { class: 'corner-tr' }, [ear]));

  const show = () => {
    const w = deck[index];
    next.classList.remove('ready');
    dots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('on', i <= index));
    const pic = h('button', { class: 'card-picture', type: 'button', 'aria-label': w.word, 'data-testid': 'card-picture' }, [thing(w.art)]);
    const first = h('button', { class: 'card-letter', type: 'button', 'aria-label': `Huruf ${w.letter}`, 'data-testid': 'card-letter' }, [w.word[0].toUpperCase()]);
    card.replaceChildren(pic, h('div', { class: 'card-word' }, [first, h('span', {}, [w.word.slice(1).toUpperCase()])]));
    const ready = () => next.classList.add('ready');
    onTap(pic, async () => {
      pic.classList.remove('wiggle');
      void pic.offsetWidth;
      pic.classList.add('wiggle');
      audio.sfx('pop');
      ready();
      await audio.play(`kata_${w.word}`);
    });
    onTap(first, async () => {
      const r = first.getBoundingClientRect();
      celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      ready();
      await audio.play(`huruf_bunyi_${w.letter.toLowerCase()}`);
      if (!alive) return;
      await audio.play('kata_untuk');
      if (!alive) return;
      await audio.play(`kata_${w.word}`);
    });
  };
  next.addEventListener('click', () => {
    if (!next.classList.contains('ready') || !alive) return;
    audio.sfx('tap');
    index++;
    if (index >= deck.length) {
      next.classList.remove('ready');
      ctx.finishRound();
      return;
    }
    show();
  });
  show();
  void audio.play('kartu_ajak');
  return () => {
    alive = false;
  };
}
