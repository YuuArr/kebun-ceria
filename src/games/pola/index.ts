import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startPola } from './view';

GAMES.push({
  id: 'pola',
  area: 'angka',
  name: 'Pola Berulang',
  parentNote: 'Melanjutkan pola (apel, pisang, apel, pisang, …). Mengenali pola adalah dasar berpikir matematis. Usia 2–3: pola AB dengan 2 pilihan; usia 4–5: pola makin panjang (AAB, ABB, ABC, AABB) dengan 3 pilihan.',
  icon: () => h('div', { class: 'icon-row' }, [thing('apel'), thing('pisang'), thing('apel'), h('span', {}, ['?'])]),
  start: startPola,
});
