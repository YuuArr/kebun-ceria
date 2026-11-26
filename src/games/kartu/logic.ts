import { wordPool, type Word } from '../../content/words';
import type { Rng } from '../../core/rng';
import { pickFresh } from '../../core/seen';
import type { AgeGroup } from '../../core/settings';
import type { PoolOptions } from '../letters/logic';

/** Five different picture-word cards, least-seen words first. */
export function makeCardDeck(age: AgeGroup, rng: Rng, level = 0, opts: PoolOptions = {}): Word[] {
  const pool = wordPool(age, level, opts.all);
  const picked = pickFresh(pool.map((w) => w.word), 5, rng, opts.seen);
  return rng.shuffle(picked.map((word) => pool.find((w) => w.word === word)!));
}
