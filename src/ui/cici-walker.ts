import { cici } from '../art/cici';
import { h } from '../art/svg';
import type { AudioService } from '../core/audio';
import { onTap } from '../core/tap';

const LINES = ['cici_hihi', 'cici_yuk', 'cici_wah'];

/** Cici on the map: blinks, wanders along the ground, and giggles when tapped. */
export function ciciWalker(audio: AudioService): { el: HTMLElement; stop: () => void } {
  const el = h('button', { class: 'map-cici', type: 'button', 'aria-label': 'Cici', 'data-testid': 'map-cici' }, [cici('happy')]);
  let pos = 8; // % of the garden width
  let alive = true;
  let timer: ReturnType<typeof setTimeout>;
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const walk = () => {
    if (!alive) return;
    const next = 4 + Math.random() * 66;
    el.classList.toggle('face-left', next < pos);
    el.classList.add('walking');
    el.style.setProperty('--x', `${next}%`);
    const ms = Math.max(1200, Math.abs(next - pos) * 70);
    el.style.setProperty('--walk-ms', `${ms}ms`);
    pos = next;
    timer = setTimeout(() => {
      el.classList.remove('walking');
      timer = setTimeout(walk, 3000 + Math.random() * 4000);
    }, ms);
  };
  el.style.setProperty('--x', `${pos}%`);
  if (!reduced) timer = setTimeout(walk, 2500);

  let line = 0;
  onTap(el, () => {
    el.classList.remove('jump');
    void el.offsetWidth;
    el.classList.add('jump');
    audio.sfx('boing');
    void audio.play(LINES[line++ % LINES.length]);
  });
  return {
    el,
    stop: () => {
      alive = false;
      clearTimeout(timer);
    },
  };
}
