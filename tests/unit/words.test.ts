import { describe, expect, it } from 'vitest';
import { WORDS } from '../../src/content/words';
import { LETTER_ORDER } from '../../src/content/letters';
import { ART_IDS, thing } from '../../src/art/things';

describe('words & art', () => {
  it('one word per letter, starting with that letter', () => {
    expect(WORDS.map((w) => w.letter)).toEqual([...LETTER_ORDER]);
    for (const w of WORDS) expect(w.word[0].toUpperCase()).toBe(w.letter);
  });
  it('every art id renders an svg', () => {
    for (const id of ART_IDS) expect(thing(id).tagName.toLowerCase()).toBe('svg');
  });
});
