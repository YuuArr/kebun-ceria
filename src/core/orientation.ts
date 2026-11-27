import { h } from '../art/svg';

/** Automated browsers (tests) skip fullscreen/rotation unless `?rotate=1` asks for it. */
const automated = () => typeof navigator !== 'undefined' && navigator.webdriver && !new URLSearchParams(location.search).has('rotate');

/**
 * Tries to switch to landscape: fullscreen + orientation lock (works on Android; iOS does not allow it).
 * Must be called from a user gesture. Never throws.
 */
export async function preferLandscape(): Promise<void> {
  if (automated() || typeof matchMedia !== 'function' || !matchMedia('(pointer: coarse)').matches) return;
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
  } catch { /* not allowed */ }
  try {
    const o = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
    await o.lock?.('landscape');
  } catch { /* iOS or not fullscreen */ }
}

/** Overlay asking to turn the phone sideways (shown by CSS only on upright touch screens). */
export function rotateHint(): HTMLElement {
  const skip = h('button', { class: 'rotate-skip', type: 'button' }, ['Lanjut tanpa memutar']);
  skip.addEventListener('click', () => document.body.classList.add('rotate-dismissed'));
  if (automated()) document.body.classList.add('rotate-dismissed');
  return h('div', { class: 'rotate-hint', role: 'dialog', 'aria-label': 'Putar HP' }, [
    h('div', { class: 'rotate-phone' }),
    h('h2', {}, ['Putar HP-mu, yuk!']),
    h('p', {}, ['Kebun Ceria paling seru dimainkan dengan HP miring.']),
    skip,
  ]);
}
