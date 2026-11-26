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
];
