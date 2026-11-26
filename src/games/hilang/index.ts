import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startHilang } from './view';

GAMES.push({
  id: 'hilang',
  area: 'pikiran',
  name: 'Apa yang Hilang?',
  parentNote: 'Anak mengamati beberapa benda, Cici menutupnya sebentar dan menyembunyikan satu, lalu anak menebak benda yang hilang. Melatih ingatan visual dan perhatian. Benda bertambah dari 3 sampai 5.',
  icon: () => h('div', { class: 'icon-row' }, [thing('apel'), h('span', {}, ['?']), thing('bola')]),
  start: startHilang,
});
