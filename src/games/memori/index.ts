import { mindIcon } from '../../art/areas';
import { GAMES } from '../registry';
import { startMemori } from './view';

GAMES.push({
  id: 'memori',
  area: 'pikiran',
  name: 'Cari Pasangan',
  parentNote: 'Permainan memori klasik: buka dua kartu, temukan gambar yang sama. Melatih ingatan kerja dan konsentrasi. Jumlah kartu bertambah seiring level (4 sampai 16 kartu).',
  icon: mindIcon,
  start: startMemori,
});
