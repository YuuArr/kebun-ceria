import { routineArt } from '../../art/routines';
import { GAMES } from '../registry';
import { startKebiasaan } from './view';

GAMES.push({
  id: 'kebiasaan',
  area: 'rumah',
  name: 'Urutkan Kebiasaan',
  parentNote: 'Mengurutkan langkah kebiasaan sehari-hari: cuci tangan, gosok gigi, dan berpakaian. Narator membacakan setiap langkah. Melatih urutan (sekuens) sekaligus menanamkan kebiasaan baik. Usia 2–3: 3 langkah utama; usia 4–5: semua langkah.',
  icon: () => routineArt('tangan_gosok'),
  start: startKebiasaan,
});
