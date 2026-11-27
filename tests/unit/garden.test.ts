import { beforeEach, describe, expect, it } from 'vitest';
import { GARDEN_STAGES, _resetGardenMemory, getAlbum, getGrowth, getSeason, getUnseen, grow, harvest, isFull, markSeen } from '../../src/core/garden';

beforeEach(() => { localStorage.clear(); _resetGardenMemory(); });

describe('garden seasons', () => {
  it('a season fills in 20 rounds and never shrinks', () => {
    expect(GARDEN_STAGES).toBe(20);
    const results = Array.from({ length: 25 }, () => grow());
    expect(getGrowth()).toBe(20);
    expect(isFull()).toBe(true);
    expect(results.slice(20).every((r) => !r.isNew)).toBe(true);
  });
  it('tracks unseen rounds', () => {
    grow(); grow(); grow();
    expect(getUnseen()).toEqual([1, 2, 3]);
    markSeen(2);
    expect(getUnseen()).toEqual([3]);
  });
  it('harvest keeps the garden in the album and starts the next theme', () => {
    expect(harvest()).toBeNull();
    for (let i = 0; i < 20; i++) grow();
    expect(getSeason()).toMatchObject({ season: 0, theme: 'bunga' });
    expect(harvest()?.theme).toBe('bunga');
    expect(getGrowth()).toBe(0);
    expect(getSeason()).toMatchObject({ season: 1, theme: 'buah', cycle: 0 });
    expect(getAlbum().map((a) => a.theme)).toEqual(['bunga']);
  });
  it('five themes, then they repeat with a new colour cycle', () => {
    const seen: string[] = [];
    for (let s = 0; s < 5; s++) { seen.push(getSeason().theme); for (let i = 0; i < 20; i++) grow(); harvest(); }
    expect(seen).toEqual(['bunga', 'buah', 'laut', 'hutan', 'angkasa']);
    expect(getSeason()).toMatchObject({ season: 5, theme: 'bunga', cycle: 1 });
  });
  it('converts the old 120-step garden', () => {
    localStorage.setItem('kc:garden', JSON.stringify({ growth: 40, seen: 40 }));
    _resetGardenMemory();
    expect(getGrowth()).toBe(7);
    expect(getUnseen()).toEqual([]);
  });
});
