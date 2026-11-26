import { wordPool, type Word } from '../../content/words';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

/** Five picture-word cards from the words in play for this age/level. */
export function makeCardDeck(age: AgeGroup, rng: Rng, level = 0): Word[] {
  return rng.shuffle(wordPool(age, level)).slice(0, 5);
}
