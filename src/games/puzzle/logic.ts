import { SKETCHES } from '../../art/sketches';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface Puzzle {
  sketchId: string;
  rows: number;
  cols: number;
}

const GRID: Record<AgeGroup, [number, number][]> = {
  '2-3': [[2, 2], [2, 2], [2, 3], [2, 3]],
  '4-5': [[2, 3], [2, 3], [3, 3], [3, 4]],
};

export function makePuzzle(age: AgeGroup, rng: Rng, level = 0): Puzzle {
  const [rows, cols] = GRID[age][Math.min(3, level)];
  return { sketchId: rng.pick(SKETCHES).id, rows, cols };
}

export const pieceCells = (p: Puzzle): { r: number; c: number; id: string }[] =>
  Array.from({ length: p.rows * p.cols }, (_, i) => ({ r: Math.floor(i / p.cols), c: i % p.cols, id: `${Math.floor(i / p.cols)}-${i % p.cols}` }));
