import { describe, expect, it } from 'vitest';
import { createPaintState } from '../../src/games/paint/logic';
import { SKETCHES } from '../../src/art/sketches';

const sketch = { id: 't', outline: '', regions: [{ id: 'a', d: '' }, { id: 'b', d: '' }] };

describe('Kuas Ajaib logic', () => {
  it('ships 4 sketches with 4–8 regions each', () => {
    expect(SKETCHES.map((s) => s.id)).toEqual(['rumah', 'mobil', 'kupu', 'ikan']);
    for (const s of SKETCHES) {
      expect(s.regions.length).toBeGreaterThanOrEqual(4);
      expect(s.regions.length).toBeLessThanOrEqual(8);
    }
  });
  it('uses merah when no bucket was chosen', () => {
    const p = createPaintState(sketch);
    p.fill('a');
    expect(p.colorOf('a')).toBe('merah');
  });
  it('same colour twice is not a change', () => {
    const p = createPaintState(sketch);
    p.select('biru');
    expect(p.fill('a').changed).toBe(true);
    expect(p.fill('a').changed).toBe(false);
  });
  it('completes only when every region has a colour, and stays complete on recolour', () => {
    const p = createPaintState(sketch);
    expect(p.fill('a').complete).toBe(false);
    p.select('hijau');
    expect(p.fill('b').complete).toBe(true);
    p.select('kuning');
    expect(p.fill('a')).toEqual({ changed: true, complete: true });
  });
  it('ignores unknown regions', () => {
    const p = createPaintState(sketch);
    expect(p.fill('zzz')).toEqual({ changed: false, complete: false });
  });
});
