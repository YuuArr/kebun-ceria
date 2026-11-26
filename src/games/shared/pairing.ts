import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import type { AudioService } from '../../core/audio';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from './choice';

/** Generic "drag each tile onto its matching target" round, used by animal games. */
export function runPairing<T extends { id: string }>(
  ctx: GameContext,
  cfg: {
    steps: T[][];
    intro: string;
    target: (t: T) => Node;
    tile: (t: T) => Node;
    tileClass?: string;
    onMatch: (t: T, audio: AudioService) => Promise<void>;
  },
): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const targetsRow = h('div', { class: 'pair-targets' });
  const tray = h('div', { class: 'pair-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play(cfg.intro));
  root.append(h('div', { class: 'pair-layout' }, [targetsRow, tray]), h('div', { class: 'corner-tr' }, [ear]));

  const runStep = (items: T[]) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((c) => c());
      cleanups = [];
      const targets = items.map((t) => h('div', { class: 'pair-target', 'data-id': t.id, 'data-testid': `target-${t.id}` }, [cfg.target(t)]));
      targetsRow.replaceChildren(...targets);
      tray.replaceChildren();
      let done = 0;
      for (const t of rng.shuffle(items)) {
        const tile = h('div', { class: `pair-tile ${cfg.tileClass ?? ''}`, 'data-id': t.id, 'data-testid': 'pair-tile' }, [cfg.tile(t)]);
        tray.append(tile);
        cleanups.push(makeDraggable(tile, {
          targets: () => targets.filter((x) => !x.classList.contains('matched')),
          onStart: () => audio.sfx('tap'),
          onReject: () => audio.sfx('boing'),
          onDrop: (target) => {
            if (!alive || (target as HTMLElement).dataset.id !== t.id) return false;
            target.classList.add('matched');
            tile.classList.add('used');
            const r = target.getBoundingClientRect();
            celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            audio.sfx('pop');
            done++;
            void (async () => {
              await cfg.onMatch(t, audio);
              if (done === items.length && alive) {
                await audio.play(rng.pick(PRAISE_IDS));
                await wait(500);
                resolve();
              }
            })();
            return true;
          },
        }));
      }
    });

  void (async () => {
    await audio.play(cfg.intro);
    for (const st of cfg.steps) {
      if (!alive) return;
      await runStep(st);
    }
    if (alive) ctx.finishRound();
  })();
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
