import { countObject } from '../../art/objects';
import { GAMES } from '../registry';
import { startCount } from './view';

GAMES.push({
  id: 'hitung',
  area: 'angka',
  name: 'Sentuh & Hitung',
  parentNote:
    'Melatih korespondensi satu-ke-satu: satu benda, satu hitungan. Anak menyentuh benda nyata (konkret), lalu melihat angkanya muncul (abstrak). Usia 2–3: 1–3 benda; usia 4–5: 3–8 benda.',
  icon: () => countObject('bebek'),
  start: startCount,
});
