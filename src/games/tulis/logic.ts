import { letterPool, type Letter } from '../../content/letters';
import { checkpoints, type Stroke } from '../../content/strokes';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';
import type { PoolOptions } from '../letters/logic';

/** Distance (in letter-box units, box is 100×140) a finger may be from the path and still count. */
export const TOLERANCE = 13;
/** Share of a stroke's checkpoints that must be visited. */
export const COVERAGE = 0.8;

export function makeTraceRound(age: AgeGroup, rng: Rng, level = 0, opts: PoolOptions = {}): Letter[] {
  return pickFresh(letterPool(age, level, opts.all), 3, rng, opts.seen);
}

/** Tracks a finger tracing strokes in order. Off-path touches are simply ignored. */
export function createTracer(strokes: Stroke[], tolerance = TOLERANCE) {
  const cps = strokes.map((s) => checkpoints(s));
  const visited = cps.map((c) => new Array<boolean>(c.length).fill(false));
  let active = 0;
  return {
    activeStroke: () => active,
    progress: () => (active >= cps.length ? 1 : visited[active].filter(Boolean).length / cps[active].length),
    touch(x: number, y: number): { stroke: number; strokeDone: boolean; letterDone: boolean } {
      if (active >= cps.length) return { stroke: active, strokeDone: false, letterDone: true };
      const stroke = active;
      cps[stroke].forEach(([cx, cy], i) => {
        if (Math.hypot(cx - x, cy - y) <= tolerance) visited[stroke][i] = true;
      });
      const v = visited[stroke];
      const done = v.filter(Boolean).length / v.length >= COVERAGE && v[0] && v[v.length - 1];
      if (done) active++;
      return { stroke, strokeDone: done, letterDone: active >= cps.length };
    },
  };
}
