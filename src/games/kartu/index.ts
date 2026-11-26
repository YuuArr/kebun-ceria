import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startKartu } from './view';

GAMES.push({
  id: 'kartu',
  area: 'huruf',
  name: 'Kartu Kata Berbicara',
  parentNote:
    'Menghubungkan gambar, bunyi, dan tulisan lewat pengulangan. Ketuk gambar untuk mendengar namanya; ketuk huruf depan untuk mendengar bunyinya ("/a/… untuk apel"). Tidak ada benar atau salah. Usia 2–3: kata berawalan vokal; usia 4–5: 14 kata.',
  icon: () => h('div', { class: 'icon-card' }, [thing('apel'), h('span', {}, ['APEL'])]),
  start: startKartu,
});
