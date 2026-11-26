import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export type CompareKind = 'banyak' | 'sedikit' | 'besar' | 'kecil';

/** For banyak/sedikit: left/right are counts. For besar/kecil: left/right are sizes (1 = small, 2 = big). */
export interface CompareQ {
  kind: CompareKind;
  left: number;
  right: number;
}

export const answerSide = (q: CompareQ): 'left' | 'right' => {
  const wantMore = q.kind === 'banyak' || q.kind === 'besar';
  return (q.left > q.right) === wantMore ? 'left' : 'right';
};

export function makeCompareRound(age: AgeGroup, rng: Rng, level = 0): CompareQ[] {
  const L = Math.min(3, level);
  const kinds: CompareKind[] = age === '2-3' ? ['banyak', 'banyak', 'banyak', 'besar', 'besar'] : ['banyak', 'sedikit', 'banyak', 'besar', 'kecil'];
  return rng.shuffle(kinds).map((kind) => {
    if (kind === 'besar' || kind === 'kecil') {
      return rng.next() < 0.5 ? { kind, left: 1, right: 2 } : { kind, left: 2, right: 1 };
    }
    // Contrast shrinks and amounts grow with level.
    const [max, gap] = age === '2-3' ? [[5, 3], [5, 3], [6, 2], [6, 2]][L] : [[6, 3], [8, 2], [9, 2], [10, 1]][L];
    const small = rng.int(1, max - gap);
    const big = rng.int(small + gap, max);
    return rng.next() < 0.5 ? { kind, left: small, right: big } : { kind, left: big, right: small };
  });
}
