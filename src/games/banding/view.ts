import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing, type ArtId } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { onTap } from '../../core/tap';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { answerSide, makeCompareRound, type CompareQ } from './logic';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const COUNTABLE: ArtId[] = ['apel', 'bebek', 'bintang', 'bola', 'ikan', 'stroberi'];
const SIZABLE: ArtId[] = ['bola', 'kucing', 'apel', 'balon', 'mobil', 'katak'];

/** Banyak-Sedikit & Besar-Kecil: tap the side that answers the question. */
export function startBanding(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const qs = makeCompareRound(ctx.settings.age, rng);
  const field = h('div', { class: 'compare-field' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  let prompt = 'banding_banyak';
  ear.addEventListener('click', () => void audio.play(prompt));
  root.append(field, h('div', { class: 'corner-tr' }, [ear]));

  const panel = (q: CompareQ, side: 'left' | 'right', art: ArtId) => {
    const value = side === 'left' ? q.left : q.right;
    const sized = q.kind === 'besar' || q.kind === 'kecil';
    const content = sized
      ? h('div', { class: `compare-one size-${value}` }, [thing(art)])
      : h('div', { class: 'compare-many', style: `--cols:${value <= 4 ? value : Math.ceil(value / 2)}` }, Array.from({ length: value }, () => thing(art)));
    return h('button', {
      class: 'compare-side', type: 'button', 'data-testid': `side-${side}`, 'aria-label': side === 'left' ? 'kiri' : 'kanan',
      ...(answerSide(q) === side ? { 'data-correct': '1' } : {}),
    }, [content]);
  };

  const ask = (q: CompareQ) =>
    new Promise<void>((resolve) => {
      prompt = `banding_${q.kind}`;
      const art = rng.pick(q.kind === 'besar' || q.kind === 'kecil' ? SIZABLE : COUNTABLE);
      const sides = (['left', 'right'] as const).map((side) => panel(q, side, art));
      field.replaceChildren(...sides);
      let solved = false;
      sides.forEach((el, i) => {
        onTap(el, async () => {
          if (solved || !alive) return;
          if (answerSide(q) !== (i === 0 ? 'left' : 'right')) {
            celebrate.bounce(el);
            audio.sfx('boing');
            return;
          }
          solved = true;
          el.classList.add('chosen');
          const r = el.getBoundingClientRect();
          celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          audio.sfx('chime');
          await audio.play(rng.pick(PRAISE_IDS));
          await wait(500);
          resolve();
        });
      });
      void audio.play(prompt);
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
