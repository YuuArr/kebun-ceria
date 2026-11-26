import type { ArtId } from '../../art/things';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export const PATTERN_ITEMS: readonly ArtId[] = ['apel', 'pisang', 'jeruk', 'anggur', 'stroberi', 'bola', 'bintang', 'bebek', 'daun', 'balon'];

export interface PatternQ {
  /** One repeat of the pattern, e.g. [A, B] or [A, A, B]. */
  unit: ArtId[];
  /** What the child sees (the next item is hidden). */
  shown: ArtId[];
  answer: ArtId;
  options: ArtId[];
}

const SHAPES: Record<string, number[]> = { AB: [0, 1], AAB: [0, 0, 1], ABB: [0, 1, 1], ABC: [0, 1, 2], AABB: [0, 0, 1, 1] };
const BY_LEVEL: Record<AgeGroup, string[][]> = {
  '2-3': [['AB'], ['AB'], ['AB'], ['AB']],
  '4-5': [['AB', 'AAB'], ['AB', 'AAB', 'ABB'], ['AAB', 'ABB', 'ABC'], ['ABB', 'ABC', 'AABB']],
};

/** Five "what comes next?" questions. */
export function makePatternRound(age: AgeGroup, rng: Rng, level = 0): PatternQ[] {
  return Array.from({ length: 5 }, () => {
    const shape = SHAPES[rng.pick(BY_LEVEL[age][Math.min(3, level)])];
    const kinds = rng.shuffle(PATTERN_ITEMS).slice(0, Math.max(...shape) + 1);
    const unit = shape.map((i) => kinds[i]);
    const total = unit.length * 2 + rng.int(1, unit.length);
    const seq = Array.from({ length: total }, (_, i) => unit[i % unit.length]);
    const answer = seq.pop()!;
    const distract = rng.shuffle(PATTERN_ITEMS.filter((x) => x !== answer));
    const nOptions = age === '2-3' ? 2 : 3;
    // Prefer another item from the pattern as a distractor (makes children look at the order).
    const others = [...new Set([...unit.filter((x) => x !== answer), ...distract])].slice(0, nOptions - 1);
    return { unit, shown: seq, answer, options: rng.shuffle([answer, ...others]) };
  });
}
