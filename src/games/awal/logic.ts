import type { Letter } from '../../content/letters';
import { wordPool, type Word } from '../../content/words';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';
import type { PoolOptions } from '../letters/logic';

export interface InitialStep {
  letters: Letter[];
  pictures: Word[];
}

/** Three steps: drag each picture to the box with its first letter. No letter repeats within a round. */
export function makeInitialRound(age: AgeGroup, rng: Rng, level = 0, opts: PoolOptions = {}): InitialStep[] {
  const pool = wordPool(age, level, opts.all);
  const k = age === '2-3' ? 2 : level >= 3 ? 4 : 3;
  const letters = [...new Set(pool.map((w) => w.letter))];
  const fresh = pickFresh(letters, Math.min(letters.length, k * 3), rng, opts.seen);
  return Array.from({ length: 3 }, (_, i) => {
    let chosen = fresh.slice(i * k, i * k + k);
    if (chosen.length < k) chosen = [...chosen, ...rng.shuffle(letters.filter((l) => !chosen.includes(l))).slice(0, k - chosen.length)];
    const words = chosen.map((l) => rng.pick(pool.filter((w) => w.letter === l)));
    return { letters: words.map((w) => w.letter), pictures: rng.shuffle(words) };
  });
}
