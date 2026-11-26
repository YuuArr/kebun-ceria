import { musicIcon } from '../../art/areas';
import { GAMES } from '../registry';
import { startXilofon } from './view';

GAMES.push({
  id: 'xilofon',
  area: 'musik',
  name: 'Xilofon & Drum',
  parentNote: 'Bermain musik bebas: xilofon 8 nada (do-re-mi) dan dua drum. Mengenalkan tinggi-rendah nada dan sebab-akibat bunyi. Tanda centang muncul setelah anak bermain sebentar.',
  icon: musicIcon,
  start: startXilofon,
});
