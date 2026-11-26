import type { ArtId } from '../../art/things';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

const ITEMS: ArtId[] = ['apel', 'bola', 'bintang', 'kucing', 'balon', 'ikan', 'mobil', 'gajah'];
const COUNT: Record<AgeGroup, number[]> = { '2-3': [3, 3, 3, 4], '4-5': [3, 4, 5, 5] };

export interface OrderStep {
  art: ArtId;
  /** Size ranks 1..n in shuffled tray order. */
  sizes: number[];
}

/** Three steps: put the same thing in order from smallest to biggest. */
export function makeOrderRound(age: AgeGroup, rng: Rng, level = 0): OrderStep[] {
  const n = COUNT[age][Math.min(3, level)];
  return rng.shuffle(ITEMS).slice(0, 3).map((art) => ({ art, sizes: rng.shuffle(Array.from({ length: n }, (_, i) => i + 1)) }));
}
