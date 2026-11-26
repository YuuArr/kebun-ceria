import { GAMES } from '../registry';
import { s, svgRoot } from '../../art/svg';
import { startLetters } from './view';

GAMES.push({
  id: 'huruf',
  area: 'huruf',
  name: 'Gelembung Huruf',
  parentNote:
    'Mengenal bentuk dan bunyi huruf (fonik). Narator menyebut bunyi huruf, anak mencari gelembungnya. Huruf dikenalkan dari yang paling mudah diucapkan (vokal dulu), bukan urut A–Z. Salah ketuk hanya membuat gelembung memantul, tanpa tanda salah. Usia 2–3: vokal saja, 3 gelembung; usia 4–5: 14 huruf, 4 gelembung.',
  icon: () =>
    svgRoot('0 0 100 100', [
      ...[
        [34, 38, 26, '#BBDEFB', 'A'],
        [70, 62, 22, '#F8BBD0', 'I'],
        [32, 78, 14, '#FFF59D', ''],
      ].map(([cx, cy, r, fill, t]) =>
        s('g', {}, [
          s('circle', { cx, cy, r, fill, stroke: '#4A3B3B', 'stroke-width': 3 }),
          s('circle', { cx: Number(cx) - Number(r) * 0.4, cy: Number(cy) - Number(r) * 0.4, r: Number(r) * 0.18, fill: '#fff' }),
          t ? s('text', { x: cx, y: Number(cy) + Number(r) * 0.38, 'text-anchor': 'middle', 'font-size': Number(r) * 1.1, 'font-weight': 700, fill: '#3B2F2F', 'font-family': 'Andika, sans-serif' }, [String(t)]) : null,
        ]),
      ),
    ]),
  start: startLetters,
});
