import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { onTap } from '../../core/tap';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { makeLetterRound, type LetterStep } from './logic';

const BUBBLE_TINTS = ['#BBDEFB', '#F8BBD0', '#FFF59D', '#C8E6C9'];
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Gelembung Huruf: find the bubble with the letter you hear. Wrong bubbles just bounce. */
export function startLetters(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let frame = 0;
  const steps = makeLetterRound(ctx.settings.age, rng, ctx.level);
  const field = h('div', { class: 'bubble-field', 'data-testid': 'bubble-field' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  let current: LetterStep | null = null;
  const sayPrompt = async () => {
    if (!current) return;
    await audio.play('huruf_cari');
    if (alive && current) await audio.play(`huruf_bunyi_${current.target.toLowerCase()}`);
  };
  ear.addEventListener('click', () => void sayPrompt());
  root.append(field, h('div', { class: 'corner-tr' }, [ear]));

  // Gentle drift: each bubble floats around its own slot, so bubbles never overlap (≤ 40 px/s).
  const floaters: { el: HTMLElement; phase: number; speed: number }[] = [];
  const tick = (t: number) => {
    for (const f of floaters) {
      const a = (t / 1000) * f.speed + f.phase;
      f.el.style.translate = `${Math.sin(a) * 14}px ${Math.cos(a * 0.8) * 18}px`;
    }
    frame = requestAnimationFrame(tick);
  };
  if (!reduced()) frame = requestAnimationFrame(tick);

  const runStep = (step: LetterStep) =>
    new Promise<void>((resolve) => {
      current = step;
      field.replaceChildren();
      floaters.length = 0;
      field.style.setProperty('--count', String(step.bubbles.length));
      let solved = false;
      step.bubbles.forEach((letter, i) => {
        const bubble = h('button', {
          class: 'bubble', type: 'button', 'aria-label': `Huruf ${letter}`, 'data-letter': letter, 'data-testid': 'bubble',
          ...(letter === step.target ? { 'data-target': '1' } : {}),
        }, [h('span', { class: 'bubble-letter' }, [letter])]);
        bubble.style.setProperty('--tint', BUBBLE_TINTS[i % BUBBLE_TINTS.length]);
        bubble.style.animationDelay = `${i * 90}ms`;
        floaters.push({ el: bubble, phase: rng.next() * Math.PI * 2, speed: 0.9 + rng.next() * 0.6 });
        onTap(bubble, async () => {
          if (!alive || solved) return;
          if (letter !== step.target) {
            celebrate.bounce(bubble);
            audio.sfx('boing');
            return;
          }
          solved = true;
          const box = bubble.getBoundingClientRect();
          celebrate.stars({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
          audio.sfx('pop');
          bubble.classList.add('popped');
          field.classList.add('solved');
          await audio.play(`huruf_nama_${letter.toLowerCase()}`);
          await audio.play(`huruf_bunyi_${letter.toLowerCase()}`);
          await audio.play(rng.pick(PRAISE_IDS));
          await wait(300);
          field.classList.remove('solved');
          resolve();
        });
        field.append(bubble);
      });
      void sayPrompt();
    });

  void (async () => {
    for (const step of steps) {
      if (!alive) return;
      await runStep(step);
    }
    if (alive) ctx.finishRound();
  })();

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
  };
}
