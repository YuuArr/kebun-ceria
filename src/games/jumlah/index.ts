import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startJumlah } from './view';

GAMES.push({
  id: 'jumlah',
  area: 'angka',
  name: 'Angka & Jumlah',
  parentNote: 'Menghubungkan lambang angka dengan banyaknya benda (tahap gambar ke abstrak). Anak menggeser angka ke kelompok yang jumlahnya sama. Usia 2–3: angka 1–3; usia 4–5: sampai 5, lalu naik hingga 10.',
  icon: () => h('div', { class: 'icon-amount' }, [h('span', { class: 'num' }, ['3']), h('span', { class: 'dots' }, ['● ● ●'])]),
  start: startJumlah,
});
