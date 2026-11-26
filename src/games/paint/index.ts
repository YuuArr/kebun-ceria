import { GAMES } from '../registry';
import { svgRoot, s } from '../../art/svg';
import { startPaint } from './view';

GAMES.push({
  id: 'kuas',
  area: 'warna',
  name: 'Kuas Ajaib Warna',
  parentNote:
    'Eksplorasi bebas untuk mengenal nama warna dasar (merah, kuning, biru, hijau). Setiap ketukan langsung berwarna penuh tanpa risiko keluar garis, jadi anak merasakan sebab-akibat tanpa aturan menang atau kalah. Setiap warna juga punya bentuk sendiri di embernya.',
  icon: () =>
    svgRoot('0 0 100 100', [
      s('path', { d: 'M20 80 L60 40 L70 50 L30 90 Z', fill: '#C98B5A', stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' }),
      s('path', { d: 'M60 40 L72 20 Q84 12 88 22 Q90 32 80 40 L70 50 Z', fill: '#E53935', stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' }),
      s('circle', { cx: 30, cy: 30, r: 10, fill: '#FDD835' }),
      s('circle', { cx: 78, cy: 76, r: 9, fill: '#1E88E5' }),
      s('circle', { cx: 48, cy: 20, r: 6, fill: '#43A047' }),
    ]),
  start: startPaint,
});
