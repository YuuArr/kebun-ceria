import { LETTER_NAMES, LETTER_ORDER, LETTER_SOUNDS } from './letters';

/** One narrator line. The owner records `text` as public/audio/<id>.mp3. */
export interface Line {
  id: string;
  text: string;
  /** Recording hint for the owner. */
  note?: string;
  /** What the browser voice says when no mp3 exists (defaults to `text`). */
  tts?: string;
}

export const COUNT_OBJECTS = ['bebek', 'apel', 'ikan', 'bintang', 'bola', 'kupu'] as const;
export type CountObject = (typeof COUNT_OBJECTS)[number];
const OBJECT_WORDS: Record<CountObject, string> = {
  bebek: 'bebek', apel: 'apel', ikan: 'ikan', bintang: 'bintang', bola: 'bola', kupu: 'kupu-kupu',
};

export const COLORS = ['merah', 'kuning', 'biru', 'hijau'] as const;
export type ColorId = (typeof COLORS)[number];

const NUMBER_WORDS = ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];

export const PRAISE_IDS = ['pujian_1', 'pujian_2', 'pujian_3', 'pujian_4', 'pujian_5', 'pujian_6'] as const;

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const LINES: readonly Line[] = [
  { id: 'umum_halo', text: 'Halo! Aku Cici. Ayo main di Kebun Ceria!', note: 'ceria, hangat' },
  { id: 'umum_peta', text: 'Mau main di mana hari ini?' },
  { id: 'umum_pilih_game', text: 'Pilih permainannya, ya!' },
  { id: 'umum_kebun_tumbuh', text: 'Lihat! Kebunmu tumbuh!', note: 'kagum, senang' },
  { id: 'umum_kode', text: 'Ayah atau Bunda, masukkan kode dulu, ya.', note: 'untuk orang tua' },
  { id: 'area_huruf', text: 'Pondok Huruf' },
  { id: 'area_angka', text: 'Kolam Angka' },
  { id: 'area_warna', text: 'Taman Warna' },
  { id: 'pujian_1', text: 'Hebat!' },
  { id: 'pujian_2', text: 'Pintar sekali!' },
  { id: 'pujian_3', text: 'Wah, keren!' },
  { id: 'pujian_4', text: 'Bagus sekali!' },
  { id: 'pujian_5', text: 'Kamu berhasil!' },
  { id: 'pujian_6', text: 'Hore!' },
  ...COUNT_OBJECTS.map((o) => ({ id: `hitung_ajak_${o}`, text: `Ayo hitung, ada berapa ${OBJECT_WORDS[o]}?` })),
  { id: 'hitung_semua', text: 'Semuanya ada…', note: 'nada menggantung, disusul angka' },
  ...NUMBER_WORDS.map((w, i) => ({ id: `angka_${i + 1}`, text: cap(w) + '!' })),
  { id: 'kuas_ajak', text: 'Pilih warna, lalu ketuk gambarnya!' },
  { id: 'kuas_selesai', text: 'Wah, gambarnya jadi cantik sekali!' },
  ...COLORS.map((c) => ({ id: `warna_${c}`, text: cap(c) + '!' })),
  { id: 'huruf_cari', text: 'Cari huruf…', note: 'nada menggantung, disusul bunyi huruf' },
  ...LETTER_ORDER.map((l) => ({
    id: `huruf_nama_${l.toLowerCase()}`,
    text: `Huruf ${LETTER_NAMES[l]}.`,
    note: `nama huruf ${l}`,
  })),
  ...LETTER_ORDER.map((l) => ({
    id: `huruf_bunyi_${l.toLowerCase()}`,
    text: `/${l.toLowerCase()}/`,
    note: LETTER_SOUNDS[l].note,
    tts: LETTER_SOUNDS[l].tts,
  })),
];

const byId = new Map(LINES.map((l) => [l.id, l]));

export function line(id: string): Line {
  const found = byId.get(id);
  if (!found) throw new Error(`Unknown voice line: ${id}`);
  return found;
}
