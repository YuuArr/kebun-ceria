import { bounceBack } from './celebrate';

export interface Point {
  x: number;
  y: number;
}

/** Nearest target whose centre is within `radius`; otherwise a target containing the point; otherwise null. */
export function nearestTarget<T extends { rect: DOMRect }>(p: Point, targets: T[], radius: number): T | null {
  let best: T | null = null;
  let bestD = Infinity;
  for (const t of targets) {
    const cx = t.rect.left + t.rect.width / 2;
    const cy = t.rect.top + t.rect.height / 2;
    const d = Math.hypot(p.x - cx, p.y - cy);
    if (d <= radius && d < bestD) {
      best = t;
      bestD = d;
    }
  }
  if (best) return best;
  return targets.find((t) => p.x >= t.rect.left && p.x <= t.rect.right && p.y >= t.rect.top && p.y <= t.rect.bottom) ?? null;
}

export interface DragOptions {
  /** Current drop targets (read at drop time so rotation/resizes are respected). */
  targets: () => Element[];
  /** Return true to accept the drop (item snaps onto the target and stays there). */
  onDrop: (target: Element) => boolean | Promise<boolean>;
  /** Called when a drop is rejected or lands nowhere (after the item flies home). */
  onReject?: () => void;
  onStart?: () => void;
  snapRadius?: number;
}

/**
 * Magnetic drag-and-drop for small fingers. Each item follows its own pointer;
 * releasing near a target snaps to it; anything else flies home softly.
 */
export function makeDraggable(el: HTMLElement, opts: DragOptions): () => void {
  const radius = opts.snapRadius ?? 90;
  let pointerId: number | null = null;
  let start: Point = { x: 0, y: 0 };
  let locked = false;
  let hover: Element | null = null;

  const setOffset = (dx: number, dy: number) => {
    el.style.translate = `${dx}px ${dy}px`;
  };
  const targetsWithRects = () => opts.targets().map((t) => ({ el: t, rect: t.getBoundingClientRect() }));
  const centre = () => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const down = (e: PointerEvent) => {
    if (locked || pointerId !== null) return;
    pointerId = e.pointerId;
    // A fly-home animation still running would override our translate.
    if (typeof el.getAnimations === 'function') el.getAnimations().forEach((a) => a.cancel());
    try { el.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
    start = { x: e.clientX, y: e.clientY };
    el.classList.add('dragging');
    opts.onStart?.();
    e.preventDefault();
  };
  const move = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    setOffset(e.clientX - start.x, e.clientY - start.y);
    const t = nearestTarget({ x: e.clientX, y: e.clientY }, targetsWithRects(), radius);
    if (t?.el !== hover) {
      hover?.classList.remove('drop-hover');
      hover = t?.el ?? null;
      hover?.classList.add('drop-hover');
    }
  };
  const goHome = () => {
    const from = el.style.translate || '0px 0px';
    el.style.translate = '';
    if (typeof el.animate === 'function') {
      el.animate([{ translate: from }, { translate: '0px 0px' }], { duration: 320, easing: 'cubic-bezier(.2,1.4,.4,1)' });
    }
    bounceBack(el);
    opts.onReject?.();
  };
  const up = async (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    el.classList.remove('dragging');
    hover?.classList.remove('drop-hover');
    hover = null;
    if (e.type === 'pointercancel') return goHome();
    // Where the finger is decides the target (more forgiving than the item's centre).
    const t = nearestTarget({ x: e.clientX, y: e.clientY }, targetsWithRects(), radius);
    if (!t) return goHome();
    locked = true;
    const ok = await opts.onDrop(t.el);
    if (!ok) {
      locked = false;
      return goHome();
    }
    // Snap the item's centre onto the target's centre.
    const c = centre();
    const tc = { x: t.rect.left + t.rect.width / 2, y: t.rect.top + t.rect.height / 2 };
    const [dx, dy] = (el.style.translate || '0px 0px').split(' ').map((v) => parseFloat(v) || 0);
    setOffset(dx + tc.x - c.x, dy + tc.y - c.y);
    el.classList.add('placed');
  };

  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.style.touchAction = 'none';
  return () => {
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
  };
}
