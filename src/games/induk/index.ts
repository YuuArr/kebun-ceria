import { h } from '../../art/svg';
import { thing } from '../../art/things';
import { GAMES } from '../registry';
import { animalArt } from '../shared/animal-art';
import { runPairing } from '../shared/pairing';
import { makeFamilyRound } from './logic';

GAMES.push({
  id: 'induk',
  area: 'hewan',
  name: 'Induk & Anak',
  parentNote: 'Anak hewan mencari induknya: geser anak hewan ke ibunya. Mengenal nama hewan dan konsep keluarga. Jumlah hewan bertambah seiring level.',
  icon: () => h('div', { class: 'icon-order' }, [thing('ayam'), thing('ayam')]),
  start: (ctx) => runPairing(ctx, {
    steps: makeFamilyRound(ctx.settings.age, ctx.rng, ctx.level),
    intro: 'induk_ajak',
    target: animalArt,
    tile: animalArt,
    tileClass: 'baby',
    onMatch: (a, audio) => audio.play(`hewan_${a.id}`),
  }),
});
