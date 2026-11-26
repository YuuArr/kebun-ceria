import type { Shape } from '../../content/lines';

export interface Slot {
  id: string;
  shape: Shape;
  /** Position in a 400×300 build area. */
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export interface Build {
  id: 'roket' | 'kereta' | 'rumah';
  slots: Slot[];
}

export const BUILDS: readonly Build[] = [
  {
    id: 'roket',
    slots: [
      { id: 'badan', shape: 'persegi-panjang', x: 160, y: 90, w: 80, h: 140, color: '#ECEFF1' },
      { id: 'kepala', shape: 'segitiga', x: 160, y: 26, w: 80, h: 64, color: '#E53935' },
      { id: 'jendela', shape: 'lingkaran', x: 176, y: 110, w: 48, h: 48, color: '#64B5F6' },
      { id: 'sirip-kiri', shape: 'segitiga', x: 112, y: 182, w: 48, h: 56, color: '#FDD835' },
      { id: 'sirip-kanan', shape: 'segitiga', x: 240, y: 182, w: 48, h: 56, color: '#FDD835' },
    ],
  },
  {
    id: 'kereta',
    slots: [
      { id: 'gerbong', shape: 'persegi-panjang', x: 60, y: 130, w: 200, h: 80, color: '#1E88E5' },
      { id: 'kabin', shape: 'persegi', x: 250, y: 90, w: 90, h: 120, color: '#E53935' },
      { id: 'cerobong', shape: 'persegi-panjang', x: 90, y: 80, w: 36, h: 50, color: '#4A3B3B' },
      { id: 'roda-1', shape: 'lingkaran', x: 80, y: 196, w: 60, h: 60, color: '#FDD835' },
      { id: 'roda-2', shape: 'lingkaran', x: 180, y: 196, w: 60, h: 60, color: '#FDD835' },
      { id: 'roda-3', shape: 'lingkaran', x: 266, y: 196, w: 60, h: 60, color: '#FDD835' },
    ],
  },
  {
    id: 'rumah',
    slots: [
      { id: 'dinding', shape: 'persegi', x: 110, y: 130, w: 170, h: 150, color: '#FFCC80' },
      { id: 'atap', shape: 'segitiga', x: 90, y: 40, w: 210, h: 92, color: '#E57373' },
      { id: 'pintu', shape: 'persegi-panjang', x: 176, y: 196, w: 40, h: 84, color: '#A0673D' },
      { id: 'matahari', shape: 'lingkaran', x: 320, y: 14, w: 64, h: 64, color: '#FDD835' },
    ],
  },
];

export function createBuild(build: Build) {
  const filled = new Set<string>();
  return {
    place(slotId: string, shape: Shape): { ok: boolean; done: boolean } {
      const slot = build.slots.find((s) => s.id === slotId);
      const ok = !!slot && slot.shape === shape && !filled.has(slotId);
      if (ok) filled.add(slotId);
      return { ok, done: filled.size === build.slots.length };
    },
  };
}
