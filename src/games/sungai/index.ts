import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startSungai } from './view';

GAMES.push({
  id: 'sungai',
  area: 'angka',
  name: 'Sungai Angka',
  parentNote:
    'Mengenal urutan angka lewat jalur batu: satu batu hilang, anak memasang batu yang benar, lalu Cici melompat sambil menghitung. Usia 2–3: batu 1–3; usia 4–5: deret 5 batu sampai angka 10 dengan 3 pilihan.',
  icon: () => h('div', { class: 'icon-stones' }, [1, 2, 3].map((n) => h('span', {}, [String(n)]))),
  start: startSungai,
});
