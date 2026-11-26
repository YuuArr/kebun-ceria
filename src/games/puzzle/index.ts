import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startPuzzle } from './view';

GAMES.push({
  id: 'puzzle',
  area: 'warna',
  name: 'Puzzle Gambar',
  parentNote: 'Menyusun potongan gambar menjadi utuh. Melatih hubungan bagian dan keseluruhan, serta kemampuan ruang. Gambar samar di papan membantu anak. Usia 2–3 mulai dari 4 keping; usia 4–5 dari 6 keping hingga 12 keping.',
  icon: () => h('div', { class: 'icon-puzzle' }, [h('span', { style: '--c:#E53935' }), h('span', { style: '--c:#FDD835' }), h('span', { style: '--c:#1E88E5' }), h('span', { class: 'missing' })]),
  start: startPuzzle,
});
