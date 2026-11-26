import { h } from '../../art/svg';
import { thing, type ArtId } from '../../art/things';
import { GAMES } from '../registry';
import { animalArt } from '../shared/animal-art';
import { runPairing } from '../shared/pairing';
import { makeFoodRound } from './logic';

GAMES.push({
  id: 'makanan',
  area: 'hewan',
  name: 'Makanan Hewan',
  parentNote: 'Memberi makan hewan dengan makanan kesukaannya: monyet dan pisang, kucing dan ikan, kelinci dan wortel, sapi dan rumput, ayam dan jagung. Mengenal hubungan hewan dan makanannya.',
  icon: () => h('div', { class: 'icon-row' }, [thing('kucing'), thing('ikan')]),
  start: (ctx) => runPairing(ctx, {
    steps: makeFoodRound(ctx.settings.age, ctx.rng, ctx.level),
    intro: 'makanan_ajak',
    target: animalArt,
    tile: (a) => thing(a.food as ArtId),
    onMatch: (a, audio) => audio.play(`makan_${a.id}`),
  }),
});
