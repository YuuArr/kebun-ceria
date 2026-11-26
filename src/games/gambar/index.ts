import { s, svgRoot } from '../../art/svg';
import { GAMES } from '../registry';
import { startGambar } from './view';

GAMES.push({
  id: 'gambar',
  area: 'warna',
  name: 'Gambar Bebas',
  parentNote: 'Kanvas kosong untuk menggambar bebas dengan jari, memilih warna, dan menempel stiker. Tidak ada aturan atau benar-salah; melatih kreativitas dan motorik. Tombol tempat sampah perlu ditahan supaya gambar tidak terhapus tidak sengaja. Ketuk tanda centang jika selesai.',
  icon: () => svgRoot('0 0 100 100', [
    s('rect', { x: 10, y: 14, width: 80, height: 72, rx: 8, fill: '#fff', stroke: '#4A3B3B', 'stroke-width': 4 }),
    s('path', { d: 'M22 66 Q36 30 50 56 T80 40', fill: 'none', stroke: '#E53935', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    s('path', { d: 'M24 34 Q34 26 44 36', fill: 'none', stroke: '#1E88E5', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    s('circle', { cx: 70, cy: 68, r: 7, fill: '#FDD835' }),
  ]),
  start: startGambar,
});
