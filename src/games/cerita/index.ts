import { h } from '../../art/svg';
import { cici } from '../../art/cici';
import { GAMES } from '../registry';
import { startCerita } from './view';

GAMES.push({
  id: 'cerita',
  area: 'huruf',
  name: 'Cerita Bergambar',
  parentNote:
    'Cerita pendek (3–5 kata per halaman). Kata menyala satu per satu mengikuti suara narator, melatih fokus dan arah membaca kiri ke kanan. Benda di gambar bisa diketuk untuk animasi dan suara, menumbuhkan minat pada buku.',
  icon: () => h('div', { class: 'icon-book' }, [cici()]),
  start: startCerita,
});
