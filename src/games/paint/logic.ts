import type { ColorId } from '../../content/lines';
import type { Sketch } from '../../art/sketches';

/** Free colouring: there is no "right" colour; the picture is done when every region has one. */
export function createPaintState(sketch: Pick<Sketch, 'regions'>) {
  const ids = new Set(sketch.regions.map((r) => r.id));
  const fills = new Map<string, ColorId>();
  let selected: ColorId = 'merah';
  const complete = () => fills.size === ids.size;
  return {
    select(color: ColorId): void {
      selected = color;
    },
    selected: () => selected,
    colorOf: (regionId: string) => fills.get(regionId),
    fill(regionId: string): { changed: boolean; complete: boolean } {
      if (!ids.has(regionId)) return { changed: false, complete: complete() };
      const changed = fills.get(regionId) !== selected;
      fills.set(regionId, selected);
      return { changed, complete: complete() };
    },
  };
}
