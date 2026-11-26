import { SKETCHES, type Sketch } from './sketches';
import { s } from './svg';

const PALETTE = ['#7CC36E', '#FDD835', '#1E88E5', '#E53935', '#FF8FB1', '#FFA94D', '#AB47BC', '#4FC3F7'];

/** A finished, coloured version of a colouring sketch (used by the puzzle). Crop with `viewBox`. */
export function coloredSketch(id: string, viewBox = '-12 -12 424 324'): SVGSVGElement {
  const sk: Sketch = SKETCHES.find((x) => x.id === id) ?? SKETCHES[0];
  return s('svg', { viewBox, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, [
    s('rect', { x: -12, y: -12, width: 424, height: 324, fill: '#FFF8E7' }),
    ...sk.regions.map((r, i) => s('path', { d: r.d, fill: PALETTE[(i * 3 + sk.id.length) % PALETTE.length], stroke: '#4A3B3B', 'stroke-width': 5, 'stroke-linejoin': 'round' })),
    s('path', { d: sk.outline, fill: 'none', stroke: '#4A3B3B', 'stroke-width': 5, 'stroke-linecap': 'round' }),
  ]);
}
