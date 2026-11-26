import { VOWEL_WORDS, WORDS, type Word } from '../../content/words';
import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

/** Five picture-word cards (vowel words only for the youngest). */
export function makeCardDeck(age: AgeGroup, rng: Rng): Word[] {
  return rng.shuffle(age === '2-3' ? VOWEL_WORDS : WORDS).slice(0, 5);
}
