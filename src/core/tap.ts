/**
 * Calls `handler` on the first pointerdown only, so a child's fast double tap counts once.
 * Returns `rearm()`; after re-arming, taps within 250 ms of the last one are still ignored.
 */
export function onTapOnce(el: Element, handler: (e: Event) => void): () => void {
  let fired = false;
  let last = -Infinity;
  el.addEventListener('pointerdown', (e) => {
    const now = Date.now();
    if (fired || now - last < 250) return;
    fired = true;
    last = now;
    handler(e);
  });
  return () => {
    fired = false;
  };
}

/** Like onTapOnce but always armed, with the same 250 ms double-tap guard. */
export function onTap(el: Element, handler: (e: Event) => void): void {
  let last = -Infinity;
  el.addEventListener('pointerdown', (e) => {
    const now = Date.now();
    if (now - last < 250) return;
    last = now;
    handler(e);
  });
}
