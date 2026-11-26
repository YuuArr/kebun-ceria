import { s, svgRoot } from '../../art/svg';
import { DIGIT_STROKES } from '../../content/strokes';
import { getSeen, markSeen } from '../../core/seen';
import { GAMES } from '../registry';
import { runTrace } from '../tulis/view';
import { makeDigitRound } from './logic';

GAMES.push({
  id: 'tulisangka',
  area: 'angka',
  name: 'Menulis Angka',
  parentNote: 'Menelusuri angka 0–9 dengan jari, garis demi garis, mulai dari titik hijau. Melatih motorik halus dan mengenal bentuk angka. Usia 2–3 mulai dari 1–3; usia 4–5 mulai dari 1–5 lalu 0–9.',
  icon: () =>
    svgRoot('0 0 100 100', [
      s('path', { d: 'M38 30 L56 14 V86', fill: 'none', stroke: '#E0D6D6', 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      s('path', { d: 'M38 30 L56 14 V58', fill: 'none', stroke: '#E53935', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      s('circle', { cx: 56, cy: 62, r: 9, fill: '#FFCC80', stroke: '#4A3B3B', 'stroke-width': 3 }),
    ]),
  start: (ctx) => {
    const items = makeDigitRound(ctx.settings.age, ctx.rng, ctx.level, getSeen('tulisangka'));
    markSeen('tulisangka', items);
    return runTrace(ctx, {
      items,
      strokes: (d) => DIGIT_STROKES[d],
      introLine: 'tulis_angka_ajak',
      nameLine: (d) => `angka_${d}`,
    });
  },
});
