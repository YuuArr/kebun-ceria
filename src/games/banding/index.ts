import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startBanding } from './view';

GAMES.push({
  id: 'banding',
  area: 'angka',
  name: 'Banyak-Sedikit',
  parentNote:
    'Sebelum menjumlah, anak perlu memahami perbandingan jumlah dan ukuran. Perbedaannya dibuat sangat jelas (misalnya 1 lawan 5) supaya langsung terlihat. Usia 2–3: "lebih banyak" dan "lebih besar"; usia 4–5: ditambah "lebih sedikit" dan "lebih kecil".',
  icon: () => h('div', { class: 'icon-compare' }, [h('div', {}, [thing('apel')]), h('div', {}, [thing('apel'), thing('apel'), thing('apel'), thing('apel')])]),
  start: startBanding,
});
