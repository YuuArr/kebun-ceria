import type { Letter } from './letters';

/** A point in the 100×140 letter box (y grows downward). */
export type Pt = [number, number];
/** One pen stroke, drawn in order from its first point. */
export type Stroke = Pt[];

const line = (...pts: Pt[]): Stroke => pts;
/** Points along an ellipse arc from angle a0 to a1 (degrees; 0 = right, 90 = down). */
function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, steps = 18): Pt[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    return [Math.round((cx + rx * Math.cos(a)) * 10) / 10, Math.round((cy + ry * Math.sin(a)) * 10) / 10] as Pt;
  });
}
const join = (...parts: Pt[][]): Stroke => parts.flat();

const P_BOWL = join(line([25, 10], [52, 10]), arc(52, 40, 26, 30, -90, 90), line([52, 70], [25, 70]));
const O_RING = arc(50, 70, 36, 58, -90, -450, 32);

/** Uppercase letters as simple stroke paths, in a common teaching order. */
export const STROKES: Record<Letter, Stroke[]> = {
  A: [line([50, 10], [15, 130]), line([50, 10], [85, 130]), line([30, 88], [70, 88])],
  B: [line([25, 10], [25, 130]), join(line([25, 10], [52, 10]), arc(52, 38, 24, 28, -90, 90), line([52, 66], [25, 66])), join(line([25, 66], [56, 66]), arc(56, 98, 28, 32, -90, 90), line([56, 130], [25, 130]))],
  C: [arc(55, 70, 38, 58, -45, -315, 28)],
  D: [line([25, 10], [25, 130]), join(line([25, 10], [42, 10]), arc(42, 70, 40, 60, -90, 90), line([42, 130], [25, 130]))],
  E: [line([75, 10], [25, 10], [25, 130], [75, 130]), line([25, 70], [65, 70])],
  F: [line([75, 10], [25, 10], [25, 130]), line([25, 70], [65, 70])],
  G: [arc(55, 70, 38, 58, -45, -330, 28), line([60, 80], [92, 80], [92, 118])],
  H: [line([20, 10], [20, 130]), line([80, 10], [80, 130]), line([20, 70], [80, 70])],
  I: [line([50, 10], [50, 130])],
  J: [join(line([70, 10], [70, 98]), arc(45, 98, 25, 32, 0, 180))],
  K: [line([25, 10], [25, 130]), line([80, 10], [25, 82]), line([44, 62], [82, 130])],
  L: [line([25, 10], [25, 130], [78, 130])],
  M: [line([15, 130], [15, 10], [50, 85], [85, 10], [85, 130])],
  N: [line([20, 130], [20, 10], [80, 130], [80, 10])],
  O: [O_RING],
  P: [line([25, 10], [25, 130]), P_BOWL],
  Q: [O_RING, line([60, 104], [90, 136])],
  R: [line([25, 10], [25, 130]), P_BOWL, line([46, 70], [82, 130])],
  S: [join(arc(50, 40, 30, 30, -20, -270), arc(50, 100, 30, 30, -90, 160))],
  T: [line([15, 10], [85, 10]), line([50, 10], [50, 130])],
  U: [join(line([20, 10], [20, 90]), arc(50, 90, 30, 40, 180, 0), line([80, 90], [80, 10]))],
  V: [line([15, 10], [50, 130], [85, 10])],
  W: [line([8, 10], [30, 130], [50, 50], [70, 130], [92, 10])],
  X: [line([20, 10], [80, 130]), line([80, 10], [20, 130])],
  Y: [line([15, 10], [50, 68]), line([85, 10], [50, 68], [50, 130])],
  Z: [line([20, 10], [80, 10], [20, 130], [80, 130])],
};

/** Evenly spaced checkpoints along a stroke (every `step` units). */
export function checkpoints(stroke: Stroke, step = 7): Pt[] {
  const out: Pt[] = [stroke[0]];
  let carry = 0;
  for (let i = 1; i < stroke.length; i++) {
    const [x0, y0] = stroke[i - 1];
    const [x1, y1] = stroke[i];
    const len = Math.hypot(x1 - x0, y1 - y0);
    let d = step - carry;
    while (d <= len) {
      out.push([x0 + ((x1 - x0) * d) / len, y0 + ((y1 - y0) * d) / len]);
      d += step;
    }
    carry = len - (d - step);
  }
  const last = stroke[stroke.length - 1];
  const tail = out[out.length - 1];
  if (Math.hypot(last[0] - tail[0], last[1] - tail[1]) > 1) out.push(last);
  return out;
}
