import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startBayangan } from './view';

GAMES.push({
  id: 'bayangan',
  area: 'warna',
  name: 'Cari Bayangan',
  parentNote: 'Mencocokkan benda dengan bayangan hitamnya. Melatih pengamatan bentuk (persepsi visual), keterampilan penting sebelum membaca. Pilihan bertambah seiring level.',
  icon: () => h('div', { class: 'icon-compare' }, [h('div', {}, [thing('kucing')]), h('div', { class: 'silhouette-icon' }, [thing('kucing')])]),
  start: startBayangan,
});
