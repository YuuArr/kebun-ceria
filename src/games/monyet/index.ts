import { monyet } from '../../art/monyet';
import { GAMES } from '../registry';
import { startMonyet } from './view';

GAMES.push({
  id: 'monyet',
  area: 'angka',
  name: 'Kasih Makan Monyet',
  parentNote:
    'Memahami "memberi sesuai jumlah yang diminta". Balon pikiran monyet menunjukkan angka beserta gambar pisangnya (Konkret–Gambar–Abstrak). Jika anak memberi lebih, monyet menolak dengan lucu tanpa menghukum. Usia 2–3: 1–3 pisang; usia 4–5: 2–6 pisang.',
  icon: monyet,
  start: startMonyet,
});
