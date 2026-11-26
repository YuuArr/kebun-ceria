import { s, svgRoot } from '../../art/svg';
import { GAMES } from '../registry';
import { startRakit } from './view';

const o = { stroke: '#4A3B3B', 'stroke-width': 3, 'stroke-linejoin': 'round' } as const;

GAMES.push({
  id: 'rakit',
  area: 'warna',
  name: 'Rakit Roket',
  parentNote:
    'Menyusun beberapa bentuk dasar menjadi benda utuh (roket, kereta, atau rumah). Melatih mengenali bentuk di dalam benda dan koordinasi tangan. Hadiahnya animasi: roket meluncur, kereta berjalan.',
  icon: () =>
    svgRoot('0 0 100 100', [
      s('path', { d: 'M40 34 H60 V74 H40 Z', fill: '#ECEFF1', ...o }),
      s('path', { d: 'M40 34 L50 12 L60 34 Z', fill: '#E53935', ...o }),
      s('circle', { cx: 50, cy: 48, r: 6, fill: '#64B5F6', ...o }),
      s('path', { d: 'M40 60 L30 76 H40 Z M60 60 L70 76 H60 Z', fill: '#FDD835', ...o }),
      s('path', { d: 'M44 78 Q50 96 56 78 Z', fill: '#FFA94D' }),
    ]),
  start: startRakit,
});
