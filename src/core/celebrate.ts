import { h } from '../art/svg';

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLORS = ['#E53935', '#FDD835', '#1E88E5', '#43A047', '#FF8FB1', '#FFA94D'];

function layer(): HTMLElement {
  let el = document.getElementById('fx');
  if (!el) {
    el = h('div', { id: 'fx', 'aria-hidden': 'true' });
    document.body.append(el);
  }
  return el;
}

function animate(el: HTMLElement, frames: Keyframe[], ms: number): Promise<void> {
  if (typeof el.animate !== 'function') {
    el.remove();
    return Promise.resolve();
  }
  const a = el.animate(frames, { duration: reduced() ? Math.min(ms, 200) : ms, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
  return a.finished.then(() => el.remove(), () => el.remove());
}

/** Small burst of stars at a screen point. */
export function stars(at: { x: number; y: number }): void {
  const fx = layer();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const star = h('div', { class: 'fx-star' }, ['★']);
    star.style.left = `${at.x}px`;
    star.style.top = `${at.y}px`;
    star.style.color = COLORS[i % COLORS.length];
    fx.append(star);
    const dx = Math.cos(angle) * 70, dy = Math.sin(angle) * 70;
    void animate(star, [
      { transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, opacity: 0 },
    ], 700);
  }
}

/** Paint splash at a point. */
export function splash(at: { x: number; y: number }, color: string): void {
  const fx = layer();
  for (let i = 0; i < 7; i++) {
    const drop = h('div', { class: 'fx-drop' });
    const size = 14 + (i % 3) * 8;
    drop.style.cssText = `left:${at.x}px;top:${at.y}px;width:${size}px;height:${size}px;background:${color}`;
    fx.append(drop);
    const angle = (i / 7) * Math.PI * 2 + 0.3;
    void animate(drop, [
      { transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * 60}px), calc(-50% + ${Math.sin(angle) * 60}px)) scale(1)`, opacity: 0 },
    ], 600);
  }
}

/** Full-screen celebration at the end of a round. */
export function big(): Promise<void> {
  const fx = layer();
  const star = h('div', { class: 'fx-bigstar' }, ['★']);
  fx.append(star);
  const pieces: Promise<void>[] = [];
  for (let i = 0; i < 36; i++) {
    const p = h('div', { class: 'fx-confetti' });
    p.style.left = `${(i * 97) % 100}%`;
    p.style.background = COLORS[i % COLORS.length];
    p.style.borderRadius = i % 3 === 0 ? '50%' : '3px';
    fx.append(p);
    const drift = ((i * 37) % 120) - 60;
    pieces.push(animate(p, [
      { transform: 'translate(0,-10vh) rotate(0deg)', opacity: 1 },
      { transform: `translate(${drift}px,105vh) rotate(${360 + i * 20}deg)`, opacity: 1 },
    ], 1600 + (i % 5) * 120));
  }
  pieces.push(animate(star, [
    { transform: 'translate(-50%,-50%) scale(0) rotate(-40deg)', opacity: 1 },
    { transform: 'translate(-50%,-50%) scale(1.2) rotate(0deg)', opacity: 1, offset: 0.4 },
    { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1, offset: 0.8 },
    { transform: 'translate(-50%,-50%) scale(1.4)', opacity: 0 },
  ], 1800));
  return Promise.all(pieces).then(() => undefined);
}

/** Soft bounce for a wrong choice: no X, no "wrong" sound. */
export function bounce(el: Element): void {
  if (typeof (el as HTMLElement).animate !== 'function') return;
  (el as HTMLElement).animate(
    [{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }],
    { duration: 450, easing: 'ease-out', composite: 'add' },
  );
}
