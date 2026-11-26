import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startRitme } from './view';

GAMES.push({
  id: 'ritme',
  area: 'musik',
  name: 'Tiru Nada',
  parentNote: 'Cici memainkan nada pendek di xilofon, lalu anak menirukannya. Melatih pendengaran, ingatan urutan, dan konsentrasi. Jika keliru, Cici memainkan ulang tanpa hukuman. Nada bertambah panjang seiring level.',
  icon: () => h('div', { class: 'icon-ritme' }, ['♪ ♫ ♪']),
  start: startRitme,
});
