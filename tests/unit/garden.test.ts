import { beforeEach, describe, expect, it } from 'vitest';
import { GARDEN_STAGES, _resetGardenMemory, getGrowth, getUnseen, grow, markSeen } from '../../src/core/garden';

beforeEach(() => { localStorage.clear(); _resetGardenMemory(); });

describe('garden', () => {
  it('starts empty', () => {
    expect(getGrowth()).toBe(0);
    expect(GARDEN_STAGES).toBe(40);
  });
  it('caps at 40 and never shrinks', () => {
    const results = Array.from({ length: 45 }, () => grow());
    expect(getGrowth()).toBe(40);
    expect(results.slice(0, 40).every((r) => r.isNew)).toBe(true);
    expect(results.slice(40).every((r) => !r.isNew && r.stage === 40)).toBe(true);
  });
  it('tracks unseen stages in order', () => {
    grow(); grow(); grow();
    expect(getUnseen()).toEqual([1, 2, 3]);
    markSeen(2);
    expect(getUnseen()).toEqual([3]);
  });
});
