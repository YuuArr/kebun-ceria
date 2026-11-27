import { beforeEach, describe, expect, it } from 'vitest';
import { clampToZone, getPositions, setPosition, _resetLayoutMemory } from '../../src/core/garden-layout';
import { themeScene } from '../../src/art/themes';

beforeEach(() => { localStorage.clear(); _resetLayoutMemory(); });

describe('garden layout', () => {
  it('ground things stay on the ground, sky things in the sky', () => {
    expect(clampToZone('ground', 500, 100)).toEqual([500, 290]);
    expect(clampToZone('sky', 500, 450)).toEqual([500, 250]);
    expect(clampToZone('ground', -50, 999)).toEqual([30, 540]);
  });
  it('remembers positions per season', () => {
    setPosition(0, '3', 100, 400);
    expect(getPositions(0)).toEqual({ 3: [100, 400] });
    expect(getPositions(1)).toEqual({});
  });
  it('base things and their grown-up versions share a key; every item has a zone', () => {
    const items = themeScene('bunga', 60).map((i) => i.el);
    const grown = items.find((e) => e.getAttribute('data-stage') === '41')!;
    expect(grown.getAttribute('data-key')).toBe('1');
    for (const e of themeScene('laut', 120).map((i) => i.el)) expect(['sky', 'ground']).toContain(e.getAttribute('data-zone'));
  });
});
