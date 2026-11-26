import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startBesarKecil } from './view';

GAMES.push({
  id: 'besarkecil',
  area: 'huruf',
  name: 'Huruf Besar-Kecil',
  parentNote: 'Memasangkan huruf kapital dengan huruf kecilnya (A dengan a). Penting karena buku cerita kebanyakan memakai huruf kecil. Huruf mengikuti pengaturan Huruf (bertahap atau semua A–Z).',
  icon: () => h('div', { class: 'icon-case' }, [h('span', {}, ['A']), h('span', { class: 'lower' }, ['a'])]),
  start: startBesarKecil,
});
