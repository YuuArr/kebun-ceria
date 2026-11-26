import { h } from '../../art/svg';
import type { AudioService } from '../../core/audio';
import { NOTES } from '../ritme/logic';

/** Toy xylophone: coloured bars, longest on the left. Pressing plays the note and calls `onPress`. */
export function xylophone(audio: AudioService, bars: number, onPress: (i: number) => void): { el: HTMLElement; flash: (i: number) => void } {
  const buttons = NOTES.slice(0, bars).map((n, i) => {
    const b = h('button', { class: 'xylo-bar', type: 'button', 'data-testid': `bar-${i}`, 'aria-label': n.name, style: `--c:${n.color};--h:${100 - i * (40 / Math.max(1, bars - 1))}%` });
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      flash(i);
      onPress(i);
    });
    return b;
  });
  const flash = (i: number) => {
    audio.tone(NOTES[i].freq);
    const b = buttons[i];
    b.classList.remove('hit');
    void b.offsetWidth;
    b.classList.add('hit');
  };
  return { el: h('div', { class: 'xylophone' }, buttons), flash };
}
