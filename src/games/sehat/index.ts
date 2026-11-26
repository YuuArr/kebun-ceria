import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { startSehat } from './view';

GAMES.push({
  id: 'sehat',
  area: 'rumah',
  name: 'Makanan Sehat',
  parentNote: 'Memilih makanan sehat (buah, sayur, telur, ikan, nasi, susu) untuk piring Cici. Permen dan minuman manis memantul kembali dengan pesan lembut, tanpa label "salah". Menumbuhkan kebiasaan makan sehat sejak dini.',
  icon: () => h('div', { class: 'icon-row' }, [thing('apel'), thing('brokoli'), thing('wortel')]),
  start: startSehat,
});
