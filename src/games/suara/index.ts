import { earIcon } from '../../art/areas';
import { h } from '../../art/svg';
import { PRAISE_IDS } from '../../content/lines';
import { GAMES } from '../registry';
import { animalArt } from '../shared/animal-art';
import { choiceButtons, wait } from '../shared/choice';
import type { GameContext } from '../types';
import { makeSoundRound, type SoundQ } from './logic';

function startSuara(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const qs = makeSoundRound(ctx.settings.age, rng, ctx.level);
  const speaker = h('button', { class: 'sound-speaker', type: 'button', 'aria-label': 'Dengar suaranya', 'data-testid': 'sound-speaker' }, [earIcon()]);
  const opts = h('div', { class: 'choice-row' });
  let current: SoundQ | null = null;
  const playSound = async () => {
    if (!current) return;
    speaker.classList.remove('ring');
    void speaker.offsetWidth;
    speaker.classList.add('ring');
    await audio.play(`suara_${current.animal.id}`);
  };
  speaker.addEventListener('click', () => void playSound());
  root.append(h('div', { class: 'suara-layout' }, [speaker, opts]));

  const ask = (q: SoundQ) =>
    new Promise<void>((resolve) => {
      current = q;
      opts.replaceChildren(...choiceButtons(q.options, {
        audio,
        render: animalArt,
        isRight: (a) => a.id === q.animal.id,
        label: (a) => a.name,
        onRight: async () => {
          await audio.play(`hewan_${q.animal.id}`);
          await audio.play(`suara_${q.animal.id}`);
          await audio.play(rng.pick(PRAISE_IDS));
          await wait(400);
          resolve();
        },
      }));
      void (async () => {
        await audio.play('suara_tanya');
        if (alive) await playSound();
      })();
    });

  void (async () => {
    for (const q of qs) {
      if (!alive) return;
      await ask(q);
    }
    if (alive) ctx.finishRound();
  })();
  return () => { alive = false; };
}

GAMES.push({
  id: 'suara',
  area: 'hewan',
  name: 'Suara Hewan',
  parentNote: 'Dengar tiruan suara hewan (mooo, kukuruyuk, meong), lalu pilih hewannya. Melatih pendengaran dan mengenal hewan. Ketuk tombol telinga besar untuk mendengar lagi.',
  icon: () => h('div', { class: 'icon-ritme' }, ['Mooo?']),
  start: startSuara,
});
