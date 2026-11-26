import { basket } from '../../art/colors';
import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startSortir } from './view';

GAMES.push({
  id: 'sortir',
  area: 'warna',
  name: 'Sortir Keranjang Warna',
  parentNote:
    'Melatih mengelompokkan benda berdasarkan warna (kategorisasi). Setiap keranjang juga punya bentuk sendiri, jadi tetap bisa dibedakan anak yang sulit membedakan warna. Usia 2–3: 2 warna; usia 4–5: 3 warna.',
  icon: () => h('div', { class: 'icon-stack' }, [basket('merah'), basket('kuning'), basket('biru')]),
  start: startSortir,
});
