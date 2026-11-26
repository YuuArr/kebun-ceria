import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { thing, type ArtId } from '../../art/things';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { makeMatchRound } from './logic';

const ARTS: ArtId[] = ['apel', 'bintang', 'bebek', 'bola', 'stroberi', 'ikan', 'jeruk', 'kupu'];

/** Angka & Jumlah: drag each numeral onto the group with that many things. */
export function startJumlah(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let cleanups: (() => void)[] = [];
  const steps = makeMatchRound(ctx.settings.age, rng, ctx.level);
  const groups = h('div', { class: 'amount-groups' });
  const tray = h('div', { class: 'numeral-tray' });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('jumlah_ajak'));
  root.append(h('div', { class: 'jumlah-layout' }, [groups, tray]), h('div', { class: 'corner-tr' }, [ear]));

  const runStep = (amounts: number[]) =>
    new Promise<void>((resolve) => {
      cleanups.forEach((c) => c());
      cleanups = [];
      const art = rng.pick(ARTS);
      const boxes = amounts.map((n) =>
        h('div', { class: 'amount-group', 'data-n': n, 'data-testid': `group-${n}`, style: `--cols:${n <= 3 ? n : Math.ceil(n / 2)}` },
          Array.from({ length: n }, () => thing(art))),
      );
      groups.replaceChildren(...boxes);
      tray.replaceChildren();
      let done = 0;
      for (const n of rng.shuffle(amounts)) {
        const tile = h('div', { class: 'numeral-tile', 'data-n': n, 'data-testid': 'numeral' }, [String(n)]);
        tray.append(tile);
        cleanups.push(makeDraggable(tile, {
          targets: () => boxes.filter((b) => !b.classList.contains('matched')),
          onStart: () => void audio.play(`angka_${n}`),
          onReject: () => audio.sfx('boing'),
          onDrop: (t) => {
            if (!alive || Number((t as HTMLElement).dataset.n) !== n) return false;
            t.classList.add('matched');
            const r = t.getBoundingClientRect();
            celebrate.stars({ x: r.left + r.width / 2, y: r.top });
            audio.sfx('pop');
            done++;
            void (async () => {
              await audio.play(`angka_${n}`);
              if (done === amounts.length && alive) {
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
    await audio.play('jumlah_ajak');
    for (const st of steps) {
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
