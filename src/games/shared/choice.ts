import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import type { AudioService } from '../../core/audio';
import { onTap } from '../../core/tap';

/**
 * "Tap the right one" buttons. Wrong taps bounce softly with a neutral boing; the right one fires once.
 * Each button carries data-correct for the right answer (used by tests).
 */
export function choiceButtons<T>(
  items: readonly T[],
  opts: {
    audio: AudioService;
    render: (item: T) => Node;
    isRight: (item: T) => boolean;
    onRight: (el: HTMLElement, item: T) => void | Promise<void>;
    className?: string;
    label?: (item: T) => string;
  },
): HTMLButtonElement[] {
  let solved = false;
  return items.map((item) => {
    const right = opts.isRight(item);
    const el = h('button', {
      class: `choice ${opts.className ?? ''}`, type: 'button', 'data-testid': 'choice', 'aria-label': opts.label?.(item),
      ...(right ? { 'data-correct': '1' } : {}),
    }, [opts.render(item)]);
    onTap(el, () => {
      if (solved) return;
      if (!right) {
        celebrate.bounce(el);
        opts.audio.sfx('boing');
        return;
      }
      solved = true;
      el.classList.add('chosen');
      const r = el.getBoundingClientRect();
      celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      opts.audio.sfx('chime');
      void opts.onRight(el, item);
    });
    return el;
  });
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
