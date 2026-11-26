import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startUrutkan } from './view';

GAMES.push({
  id: 'urutkan',
  area: 'pikiran',
  name: 'Urutkan Kecil-Besar',
  parentNote: 'Mengurutkan benda yang sama dari yang terkecil sampai yang terbesar (seriasi), dasar memahami ukuran dan urutan bilangan. Jumlah benda bertambah dari 3 sampai 5.',
  icon: () => h('div', { class: 'icon-order' }, [thing('bola'), thing('bola'), thing('bola')]),
  start: startUrutkan,
});
