import { h, s } from '../art/svg';

/**
 * A button that only fires after being held for `ms` (parent gate).
 * A short tap does nothing, so children don't open it by accident.
 */
export function createHoldButton(onActivate: () => void, ms = 3000, label = 'Pojok Orang Tua (tahan 3 detik)'): HTMLButtonElement {
  const ring = s('circle', { cx: 32, cy: 32, r: 28, fill: 'none', stroke: 'currentColor', 'stroke-width': 5, 'stroke-dasharray': 176, 'stroke-dashoffset': 176, class: 'hold-ring' });
  const lock = s('g', { fill: 'currentColor' }, [
    s('rect', { x: 22, y: 30, width: 20, height: 16, rx: 3 }),
    s('path', { d: 'M26 30v-5a6 6 0 0 1 12 0v5', fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }),
  ]);
  const btn = h('button', { class: 'hold-button', 'aria-label': label, type: 'button', 'data-testid': 'parent-button' }, [
    s('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' }, [ring, lock]),
  ]);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
    btn.classList.remove('holding');
  };
  btn.addEventListener('pointerdown', () => {
    cancel();
    btn.style.setProperty('--hold-ms', `${ms}ms`);
    btn.classList.add('holding');
    timer = setTimeout(() => {
      cancel();
      onActivate();
    }, ms);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) btn.addEventListener(ev, cancel);
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  return btn;
}
