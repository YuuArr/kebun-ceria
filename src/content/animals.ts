import type { ArtId } from '../art/things';

export interface Animal {
  id: 'sapi' | 'ayam' | 'bebek' | 'kucing' | 'domba' | 'katak' | 'monyet' | 'gajah' | 'kelinci';
  art: ArtId | 'cici';
  name: string;
  /** How the narrator imitates it. */
  sound: string;
  food?: ArtId;
}

export const ANIMALS: readonly Animal[] = [
  { id: 'sapi', art: 'sapi', name: 'Sapi', sound: 'Mooo… mooo!', food: 'daun' },
  { id: 'ayam', art: 'ayam', name: 'Ayam', sound: 'Kukuruyuuuk!', food: 'jagung' },
  { id: 'bebek', art: 'bebek', name: 'Bebek', sound: 'Kwek, kwek, kwek!' },
  { id: 'kucing', art: 'kucing', name: 'Kucing', sound: 'Meong… meong!', food: 'ikan' },
  { id: 'domba', art: 'domba', name: 'Domba', sound: 'Mbeee… mbeee!' },
  { id: 'katak', art: 'katak', name: 'Katak', sound: 'Kung kong, kung kong!' },
  { id: 'monyet', art: 'monyet', name: 'Monyet', sound: 'Uu-uu, aa-aa!', food: 'pisang' },
  { id: 'gajah', art: 'gajah', name: 'Gajah', sound: 'Ngoooong!' },
  { id: 'kelinci', art: 'cici', name: 'Kelinci', sound: '', food: 'wortel' },
];

export const SOUNDING = ANIMALS.filter((a) => a.sound);
export const EATING = ANIMALS.filter((a) => a.food);
