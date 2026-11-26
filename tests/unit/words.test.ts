import { describe, expect, it } from 'vitest';
import { WORDS } from '../../src/content/words';
import { LETTER_ORDER } from '../../src/content/letters';
import { ART_IDS, thing } from '../../src/art/things';

describe('words & art', () => {
  it('every letter except Q has a word, most have two or three; words start with their letter', () => {
    for (const l of LETTER_ORDER.filter((x) => x !== 'Q')) expect(WORDS.some((w) => w.letter === l)).toBe(true);
    const multi = LETTER_ORDER.filter((l) => WORDS.filter((w) => w.letter === l).length >= 2);
    expect(multi.length).toBeGreaterThanOrEqual(18);
    expect(new Set(WORDS.map((w) => w.word)).size).toBe(WORDS.length);
    expect(new Set(WORDS.map((w) => w.art)).size).toBe(WORDS.length);
    for (const w of WORDS) expect(w.word[0].toUpperCase()).toBe(w.letter);
  });
  it('every art id renders an svg', () => {
    for (const id of ART_IDS) expect(thing(id).tagName.toLowerCase()).toBe('svg');
  });
});
