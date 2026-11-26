import { shapeSvg } from '../../art/shapes';
import { h } from '../../art/svg';
import { GAMES } from '../registry';
import { startKotakPos } from './view';

GAMES.push({
  id: 'kotakpos',
  area: 'warna',
  name: 'Kotak Pos Bentuk',
  parentNote:
    'Adaptasi mainan balok klasik: anak memasukkan benda sehari-hari (donat, pizza, kado) ke lubang yang bentuknya sama. Mengajarkan bahwa bentuk geometri ada di sekitar kita, sekaligus melatih motorik geser. Salah lubang hanya memantul "boing". Usia 2–3: lingkaran, segitiga, persegi; usia 4–5: ditambah persegi panjang, bintang, hati.',
  icon: () => h('div', { class: 'icon-stack' }, [shapeSvg('lingkaran', '#E53935'), shapeSvg('segitiga', '#FDD835'), shapeSvg('persegi', '#1E88E5')]),
  start: startKotakPos,
});
