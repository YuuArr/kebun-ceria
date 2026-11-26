import { s, svgRoot } from './svg';

export type CiciMood = 'happy' | 'cheer';

/** Cici the rabbit, the guide mascot. Original drawing. */
export function cici(mood: CiciMood = 'happy'): SVGSVGElement {
  const fur = '#FFFFFF';
  const line = '#4A3B3B';
  const pink = '#FFB3C7';
  const arms =
    mood === 'cheer'
      ? [
          s('path', { d: 'M62 150 Q40 120 44 98', stroke: line, 'stroke-width': 5, fill: fur, 'stroke-linecap': 'round' }),
          s('path', { d: 'M138 150 Q160 120 156 98', stroke: line, 'stroke-width': 5, fill: fur, 'stroke-linecap': 'round' }),
        ]
      : [
          s('ellipse', { cx: 66, cy: 170, rx: 12, ry: 18, fill: fur, stroke: line, 'stroke-width': 4 }),
          s('ellipse', { cx: 134, cy: 170, rx: 12, ry: 18, fill: fur, stroke: line, 'stroke-width': 4 }),
        ];
  return svgRoot('0 0 200 240', [
    // ears
    s('g', { class: 'cici-ears' }, [
      s('ellipse', { cx: 72, cy: 52, rx: 18, ry: 48, fill: fur, stroke: line, 'stroke-width': 4, transform: 'rotate(-12 72 52)' }),
      s('ellipse', { cx: 72, cy: 56, rx: 8, ry: 34, fill: pink, transform: 'rotate(-12 72 56)' }),
      s('ellipse', { cx: 128, cy: 52, rx: 18, ry: 48, fill: fur, stroke: line, 'stroke-width': 4, transform: 'rotate(12 128 52)' }),
      s('ellipse', { cx: 128, cy: 56, rx: 8, ry: 34, fill: pink, transform: 'rotate(12 128 56)' }),
    ]),
    // body
    s('ellipse', { cx: 100, cy: 190, rx: 46, ry: 44, fill: fur, stroke: line, 'stroke-width': 4 }),
    s('ellipse', { cx: 100, cy: 198, rx: 26, ry: 26, fill: '#FFF1F5' }),
    ...arms,
    // feet
    s('ellipse', { cx: 76, cy: 230, rx: 20, ry: 9, fill: fur, stroke: line, 'stroke-width': 4 }),
    s('ellipse', { cx: 124, cy: 230, rx: 20, ry: 9, fill: fur, stroke: line, 'stroke-width': 4 }),
    // head
    s('circle', { cx: 100, cy: 118, r: 50, fill: fur, stroke: line, 'stroke-width': 4 }),
    // eyes
    s('ellipse', { cx: 82, cy: 112, rx: 7, ry: 9, fill: line }),
    s('ellipse', { cx: 118, cy: 112, rx: 7, ry: 9, fill: line }),
    s('circle', { cx: 84, cy: 109, r: 2.5, fill: '#fff' }),
    s('circle', { cx: 120, cy: 109, r: 2.5, fill: '#fff' }),
    // cheeks
    s('ellipse', { cx: 70, cy: 132, rx: 9, ry: 6, fill: pink, opacity: 0.8 }),
    s('ellipse', { cx: 130, cy: 132, rx: 9, ry: 6, fill: pink, opacity: 0.8 }),
    // nose + mouth
    s('path', { d: 'M95 124 h10 l-5 6 z', fill: '#FF7FA3' }),
    s('path', { d: 'M100 130 q-8 10 -14 4 M100 130 q8 10 14 4', fill: 'none', stroke: line, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    // flower on ear
    s('g', { transform: 'translate(138 30)' }, [
      ...[0, 72, 144, 216, 288].map((a) => s('circle', { cx: 0, cy: -8, r: 7, fill: '#FFD54F', transform: `rotate(${a})` })),
      s('circle', { r: 5, fill: '#FF8A65' }),
    ]),
  ], { class: 'cici' });
}
