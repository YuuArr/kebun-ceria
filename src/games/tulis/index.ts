import { s, svgRoot } from '../../art/svg';
import { GAMES } from '../registry';
import { startTulis } from './view';

GAMES.push({
  id: 'tulis',
  area: 'huruf',
  name: 'Menulis Huruf',
  parentNote:
    'Melatih motorik halus dan arah menulis: anak menelusuri huruf dengan jari, garis demi garis, mulai dari titik hijau bernomor. Keluar jalur tidak dihukum, hanya tidak terhitung. Setelah selesai, narator menyebut nama dan bunyi hurufnya. Huruf mengikuti pengaturan Huruf (bertahap atau semua A–Z).',
  icon: () =>
    svgRoot('0 0 100 100', [
      s('path', { d: 'M30 85 L50 15 L70 85 M38 60 H62', fill: 'none', stroke: '#E0D6D6', 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      s('path', { d: 'M30 85 L50 15 L60 50', fill: 'none', stroke: '#1E88E5', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      s('circle', { cx: 62, cy: 54, r: 9, fill: '#FFCC80', stroke: '#4A3B3B', 'stroke-width': 3 }),
    ]),
  start: startTulis,
});
