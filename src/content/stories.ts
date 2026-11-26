import type { ArtId } from '../art/things';

export interface StoryThing {
  art: ArtId | 'cici' | 'bunga' | 'pohon';
  /** Position/size in a 400×240 scene. */
  x: number;
  y: number;
  size: number;
  /** What happens when tapped. */
  motion: 'hop' | 'wiggle' | 'spin' | 'fly';
  sfx: 'pop' | 'boing' | 'chime' | 'splash';
}

export interface StoryPage {
  /** 3–5 words; also the narrator line `cerita_<n>`. */
  text: string;
  sky: string;
  ground: string;
  things: StoryThing[];
}

export interface Story {
  id: string;
  title: string;
  pages: StoryPage[];
}

const C = (x: number, y = 150, size = 90): StoryThing => ({ art: 'cici', x, y, size, motion: 'hop', sfx: 'boing' });

export const STORIES: readonly Story[] = [
  {
    id: 'wortel',
    title: 'Cici Mencari Wortel',
    pages: [
      { text: 'Cici lapar sekali.', sky: '#BDE6FF', ground: '#7CC36E', things: [C(200, 140, 110), { art: 'pohon', x: 70, y: 120, size: 120, motion: 'wiggle', sfx: 'chime' }] },
      { text: 'Cici mencari wortel.', sky: '#BDE6FF', ground: '#7CC36E', things: [C(120), { art: 'bunga', x: 260, y: 170, size: 60, motion: 'wiggle', sfx: 'chime' }, { art: 'bunga', x: 320, y: 180, size: 50, motion: 'wiggle', sfx: 'chime' }] },
      { text: 'Ada bebek di kolam.', sky: '#BDE6FF', ground: '#6EC6F0', things: [{ art: 'bebek', x: 160, y: 160, size: 80, motion: 'hop', sfx: 'pop' }, { art: 'bebek', x: 260, y: 170, size: 60, motion: 'hop', sfx: 'pop' }, C(60, 120, 70)] },
      { text: 'Ada kupu-kupu terbang.', sky: '#BDE6FF', ground: '#7CC36E', things: [{ art: 'kupu', x: 150, y: 70, size: 60, motion: 'fly', sfx: 'chime' }, { art: 'kupu', x: 270, y: 50, size: 50, motion: 'fly', sfx: 'chime' }, C(210, 160, 90)] },
      { text: 'Itu dia wortelnya!', sky: '#FFE9B8', ground: '#7CC36E', things: [{ art: 'wortel', x: 270, y: 160, size: 80, motion: 'spin', sfx: 'chime' }, C(130, 150, 100)] },
      { text: 'Nyam, Cici kenyang!', sky: '#FFE9B8', ground: '#7CC36E', things: [C(200, 140, 120), { art: 'wortel', x: 300, y: 180, size: 50, motion: 'wiggle', sfx: 'pop' }] },
    ],
  },
  {
    id: 'bola',
    title: 'Bola Cici',
    pages: [
      { text: 'Cici punya bola merah.', sky: '#BDE6FF', ground: '#7CC36E', things: [C(150, 140, 100), { art: 'bola', x: 260, y: 180, size: 50, motion: 'spin', sfx: 'boing' }] },
      { text: 'Bolanya menggelinding jauh.', sky: '#BDE6FF', ground: '#7CC36E', things: [C(80, 140, 80), { art: 'bola', x: 330, y: 190, size: 44, motion: 'spin', sfx: 'boing' }, { art: 'pohon', x: 220, y: 120, size: 110, motion: 'wiggle', sfx: 'chime' }] },
      { text: 'Bola masuk ke kolam.', sky: '#BDE6FF', ground: '#6EC6F0', things: [{ art: 'bola', x: 230, y: 175, size: 46, motion: 'hop', sfx: 'splash' }, { art: 'katak', x: 330, y: 190, size: 60, motion: 'hop', sfx: 'boing' }, C(80, 120, 70)] },
      { text: 'Bebek mengembalikan bola.', sky: '#BDE6FF', ground: '#6EC6F0', things: [{ art: 'bebek', x: 220, y: 170, size: 80, motion: 'hop', sfx: 'pop' }, { art: 'bola', x: 290, y: 175, size: 40, motion: 'spin', sfx: 'boing' }, C(90, 130, 80)] },
      { text: 'Terima kasih, Bebek!', sky: '#FFE9B8', ground: '#7CC36E', things: [C(150, 140, 100), { art: 'bebek', x: 270, y: 175, size: 70, motion: 'hop', sfx: 'pop' }, { art: 'bola', x: 205, y: 200, size: 36, motion: 'spin', sfx: 'boing' }] },
    ],
  },
  {
    id: 'pesta',
    title: 'Pesta Ulang Tahun Cici',
    pages: [
      { text: 'Hari ini Cici ulang tahun.', sky: '#FFE9B8', ground: '#7CC36E', things: [C(200, 140, 110), { art: 'balon', x: 90, y: 80, size: 50, motion: 'fly', sfx: 'pop' }, { art: 'balon-hati', x: 320, y: 70, size: 50, motion: 'fly', sfx: 'pop' }] },
      { text: 'Kucing membawa balon.', sky: '#FFE9B8', ground: '#7CC36E', things: [{ art: 'kucing', x: 200, y: 170, size: 80, motion: 'hop', sfx: 'boing' }, { art: 'balon', x: 250, y: 80, size: 50, motion: 'fly', sfx: 'pop' }] },
      { text: 'Katak membawa kado.', sky: '#FFE9B8', ground: '#7CC36E', things: [{ art: 'katak', x: 160, y: 180, size: 80, motion: 'hop', sfx: 'boing' }, { art: 'kado', x: 260, y: 175, size: 70, motion: 'wiggle', sfx: 'chime' }] },
      { text: 'Ada kue yang besar.', sky: '#FFE9B8', ground: '#7CC36E', things: [{ art: 'kue-hati', x: 200, y: 150, size: 120, motion: 'wiggle', sfx: 'chime' }, C(70, 150, 70)] },
      { text: 'Selamat ulang tahun, Cici!', sky: '#FFE9B8', ground: '#7CC36E', things: [C(200, 140, 100), { art: 'kucing', x: 90, y: 180, size: 60, motion: 'hop', sfx: 'boing' }, { art: 'katak', x: 320, y: 185, size: 60, motion: 'hop', sfx: 'boing' }, { art: 'balon', x: 140, y: 60, size: 40, motion: 'fly', sfx: 'pop' }, { art: 'balon-hati', x: 270, y: 60, size: 40, motion: 'fly', sfx: 'pop' }] },
    ],
  },
];
