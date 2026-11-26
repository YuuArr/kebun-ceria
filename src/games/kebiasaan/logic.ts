import { ROUTINES, type Routine } from '../../content/routines';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export interface RoutineQ {
  routine: Routine;
  /** Steps in the correct order (a subset for the youngest). */
  steps: Routine['steps'];
}

/** Two different routines per round. Age 2–3 orders 3 key steps; 4–5 orders all steps from level 1. */
export function makeRoutineRound(age: AgeGroup, rng: Rng, level = 0): RoutineQ[] {
  return rng.shuffle(ROUTINES).slice(0, 2).map((routine) => {
    const all = routine.steps;
    const n = age === '2-3' ? 3 : level >= 1 ? all.length : Math.min(4, all.length);
    if (n >= all.length) return { routine, steps: [...all] };
    // keep first and last, drop middle steps at random
    const middle = rng.shuffle(all.slice(1, -1)).slice(0, n - 2);
    return { routine, steps: all.filter((s, i) => i === 0 || i === all.length - 1 || middle.includes(s)) };
  });
}
