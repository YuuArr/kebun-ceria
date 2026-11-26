import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startAwal } from './view';

GAMES.push({
  id: 'awal',
  area: 'huruf',
  name: 'Cocokkan Huruf Awal',
  parentNote:
    'Melatih kesadaran bunyi awal kata (fonik): anak menggeser gambar ke kotak huruf depannya, lalu mendengar "/b/… untuk bola". Kotak bersifat magnetis supaya tidak frustrasi. Usia 2–3: 2 kotak huruf vokal; usia 4–5: 3 kotak dari 14 huruf.',
  icon: () => h('div', { class: 'icon-awal' }, [h('span', {}, ['B']), thing('bola')]),
  start: startAwal,
});
