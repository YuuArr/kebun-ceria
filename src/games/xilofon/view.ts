import { h, s, svgRoot } from '../../art/svg';
import { onTap } from '../../core/tap';
import type { GameContext } from '../types';
import { xylophone } from '../shared/xylophone';

const READY_AFTER = 12;

/** Xilofon & Drum Bebas: free play; the check mark appears after a little music-making. */
export function startXilofon(ctx: GameContext): () => void {
  const { root, audio } = ctx;
  let alive = true;
  let taps = 0;
  const notes = h('div', { class: 'note-sky' });
  const count = () => {
    taps++;
    if (taps >= READY_AFTER) done.classList.add('ready');
    const n = h('span', { class: 'flying-note', style: `left:${10 + Math.random() * 80}%` }, ['♪']);
    notes.append(n);
    setTimeout(() => n.remove(), 1200);
  };
  const xylo = xylophone(audio, 8, count);
  const drum = (kind: 'kick' | 'tambourine', label: string) => {
    const b = h('button', { class: `drum-pad drum-${kind}`, type: 'button', 'aria-label': label, 'data-testid': `drum-${kind}` });
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      audio.drum(kind);
      b.classList.remove('hit');
      void b.offsetWidth;
      b.classList.add('hit');
      count();
    });
    return b;
  };
  const done = h('button', { class: 'tool-btn done-btn', type: 'button', 'aria-label': 'Selesai', 'data-testid': 'music-done' }, [
    svgRoot('0 0 64 64', [s('path', { d: 'M14 34 L28 48 L52 18', fill: 'none', stroke: '#fff', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]),
  ]);
  onTap(done, async () => {
    if (!done.classList.contains('ready') || !alive) return;
    done.classList.remove('ready');
    await audio.play('musik_selesai');
    if (alive) ctx.finishRound();
  });
  root.append(h('div', { class: 'music-layout' }, [notes, xylo.el, h('div', { class: 'drum-row' }, [drum('kick', 'drum'), drum('tambourine', 'rebana'), done])]));
  void audio.play('musik_ajak');
  return () => { alive = false; };
}
