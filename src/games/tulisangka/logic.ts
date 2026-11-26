import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';

const POOLS: Record<AgeGroup, string[][]> = {
  '2-3': [['1', '2', '3'], ['1', '2', '3', '4', '5'], ['0', '1', '2', '3', '4', '5'], ['0', '1', '2', '3', '4', '5']],
  '4-5': [['1', '2', '3', '4', '5'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
};

/** Three different digits to trace, least-traced first. */
export function makeDigitRound(age: AgeGroup, rng: Rng, level = 0, seen: Record<string, number> = {}): string[] {
  return pickFresh(POOLS[age][Math.min(3, level)], 3, rng, seen);
}
