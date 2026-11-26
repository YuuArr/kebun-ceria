import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startSusun } from './view';

GAMES.push({
  id: 'susun',
  area: 'huruf',
  name: 'Susun Suku Kata',
  parentNote: 'Langkah menuju membaca: anak menyusun suku kata menjadi kata (BO + LA = BOLA), dari kiri ke kanan, lalu mendengar katanya. Dimulai dari kata dua suku terbuka (BO-LA, SA-PI), lalu suku tertutup (MO-BIL), suku pengecoh, dan kata tiga suku.',
  icon: () => h('div', { class: 'icon-case' }, [h('span', {}, ['BO']), h('span', { class: 'lower' }, ['LA'])]),
  start: startSusun,
});
