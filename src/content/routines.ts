/** Daily routines as ordered steps; each step has a picture id (src/art/routines.ts) and a voice line. */
export interface Routine {
  id: 'tangan' | 'gigi' | 'baju';
  intro: string;
  steps: { art: string; text: string }[];
}

export const ROUTINES: readonly Routine[] = [
  {
    id: 'tangan',
    intro: 'Ayo cuci tangan! Urutkan gambarnya.',
    steps: [
      { art: 'tangan_keran', text: 'Buka keran, basahi tangan.' },
      { art: 'tangan_sabun', text: 'Pakai sabun.' },
      { art: 'tangan_gosok', text: 'Gosok tangan sampai berbusa.' },
      { art: 'tangan_bilas', text: 'Bilas dengan air.' },
      { art: 'tangan_lap', text: 'Keringkan dengan handuk.' },
    ],
  },
  {
    id: 'gigi',
    intro: 'Ayo gosok gigi! Urutkan gambarnya.',
    steps: [
      { art: 'gigi_pasta', text: 'Taruh pasta gigi di sikat.' },
      { art: 'gigi_sikat', text: 'Sikat gigi pelan-pelan.' },
      { art: 'gigi_kumur', text: 'Berkumur dengan air.' },
      { art: 'gigi_senyum', text: 'Gigi bersih, senyum!' },
    ],
  },
  {
    id: 'baju',
    intro: 'Ayo berpakaian! Urutkan gambarnya.',
    steps: [
      { art: 'baju_kaos', text: 'Pakai kaos.' },
      { art: 'baju_celana', text: 'Pakai celana.' },
      { art: 'baju_kaus', text: 'Pakai kaus kaki.' },
      { art: 'baju_sepatu', text: 'Pakai sepatu.' },
    ],
  },
];
