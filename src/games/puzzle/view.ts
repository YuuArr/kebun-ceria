import { earIcon } from '../../art/areas';
import { coloredSketch } from '../../art/colored';
import { h } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { makeDraggable } from '../../core/drag';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { makePuzzle, pieceCells } from './logic';

const W = 424;
const H = 324;

/** Puzzle Gambar: put the picture back together; each piece snaps only into its own place. */
export function startPuzzle(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const p = makePuzzle(ctx.settings.age, rng, ctx.level);
  const cw = W / p.cols;
  const ch = H / p.rows;
  const crop = (r: number, c: number) => `${-12 + c * cw} ${-12 + r * ch} ${cw} ${ch}`;
  const cells = pieceCells(p);
  const board = h('div', { class: 'puzzle-board', style: `--rows:${p.rows};--cols:${p.cols}`, 'data-testid': 'puzzle-board' });
  const ghost = coloredSketch(p.sketchId);
  ghost.classList.add('puzzle-ghost');
  board.append(ghost);
  const slots = cells.map((cell) => {
    const el = h('div', { class: 'puzzle-slot', 'data-cell': cell.id, 'data-testid': `slot-${cell.id}` });
    board.append(el);
    return el;
  });
  const tray = h('div', { class: 'puzzle-tray' });
  let placed = 0;
  const cleanups = rng.shuffle(cells).map((cell) => {
    const piece = h('div', { class: 'puzzle-piece', 'data-cell': cell.id, 'data-testid': 'puzzle-piece', style: `aspect-ratio:${cw}/${ch}` }, [coloredSketch(p.sketchId, crop(cell.r, cell.c))]);
    tray.append(piece);
    return makeDraggable(piece, {
      targets: () => slots.filter((s) => !s.classList.contains('filled')),
      onStart: () => audio.sfx('tap'),
      onReject: () => audio.sfx('boing'),
      snapRadius: 60,
      onDrop: (t) => {
        if (!alive || (t as HTMLElement).dataset.cell !== cell.id) return false;
        t.classList.add('filled');
        t.append(coloredSketch(p.sketchId, crop(cell.r, cell.c)));
        piece.classList.add('used');
        audio.sfx('pop');
        placed++;
        if (placed === cells.length) {
          void (async () => {
            board.classList.add('complete');
            const r = board.getBoundingClientRect();
            celebrate.stars({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            await audio.play(rng.pick(PRAISE_IDS));
            await wait(700);
            if (alive) ctx.finishRound();
          })();
        }
        return true;
      },
    });
  });
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  ear.addEventListener('click', () => void audio.play('puzzle_ajak'));
  root.append(h('div', { class: 'puzzle-layout' }, [board, tray]), h('div', { class: 'corner-tr' }, [ear]));
  void audio.play('puzzle_ajak');
  return () => {
    alive = false;
    cleanups.forEach((c) => c());
  };
}
