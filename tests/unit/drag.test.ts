import { describe, expect, it } from 'vitest';
import { nearestTarget } from '../../src/core/drag';

const r = (x: number, y: number, w = 100, h = 100) => ({ rect: { left: x, top: y, width: w, height: h, right: x + w, bottom: y + h } as DOMRect, id: `${x},${y}` });

describe('nearestTarget', () => {
  it('picks the nearest centre within the radius', () => {
    const a = r(0, 0), b = r(200, 0);
    expect(nearestTarget({ x: 160, y: 50 }, [a, b], 90)).toBe(b);
  });
  it('returns null when far from every target', () => {
    expect(nearestTarget({ x: 600, y: 600 }, [r(0, 0), r(200, 0)], 90)).toBeNull();
  });
  it('accepts a point inside a big target far from its centre', () => {
    const big = r(0, 0, 400, 400);
    expect(nearestTarget({ x: 390, y: 390 }, [big], 90)).toBe(big);
  });
});
