import { describe, expect, it } from 'vitest';
import { gardenScene } from '../../src/art/garden-more';

describe('garden scene', () => {
  it('arrivals, then grow-ups (same spots), then decorations', () => {
    expect(gardenScene(0)).toHaveLength(0);
    expect(gardenScene(40)).toHaveLength(40);
    const g60 = gardenScene(60);
    expect(g60).toHaveLength(40); // grow-ups replace, never add clutter
    expect(g60.filter((i) => i.stage > 40)).toHaveLength(20);
    expect(gardenScene(80).every((i) => i.stage > 40)).toBe(true);
    expect(gardenScene(120)).toHaveLength(80);
  });
  it('each stage up to 120 appears exactly once at its growth', () => {
    for (let g = 1; g <= 120; g++) {
      const stages = gardenScene(g).map((i) => i.stage);
      expect(stages).toContain(g);
      expect(new Set(stages).size).toBe(stages.length);
    }
  });
});
