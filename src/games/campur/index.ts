import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startCampur } from './view';

GAMES.push({
  id: 'campur',
  area: 'warna',
  name: 'Campur Warna',
  parentNote: 'Mengenal warna campuran: merah + kuning = oranye, kuning + biru = hijau, merah + biru = ungu. Usia 2–3 bebas mencoba-coba; usia 4–5 diberi tugas membuat warna tertentu. Hasil yang belum tepat tetap disebut namanya, tanpa tanda salah.',
  icon: () => h('div', { class: 'icon-mix' }, [h('span', { style: '--c:#E53935' }), h('span', { style: '--c:#FDD835' }), h('span', { style: '--c:#FB8C00' })]),
  start: startCampur,
});
