import { h } from '../art/svg';
import * as celebrate from '../core/celebrate';
import { grow } from '../core/garden';
import { addRound, getLevel } from '../core/progress';
import { createRng } from '../core/rng';
import { go, type Screen } from '../core/router';
import { getSettings } from '../core/settings';
import { PRAISE_IDS } from '../content/lines';
import { gameById } from '../games/registry';
import { audio } from '../services';
import { homeButton } from './home-button';

export const gameScreen: Screen = (root, params) => {
  const game = gameById(params.id ?? '');
  if (!game) {
    go('map');
    return () => {};
  }
  const area = game.area;
  let alive = true;
  let finished = false;
  const stage = h('div', { class: `game-stage game-${game.id}`, 'data-testid': 'game-stage' });
  root.append(
    h('div', { class: `screen game-screen bg-${area}` }, [
      stage,
      h('div', { class: 'corner-tl' }, [homeButton(() => go('area', { area }))]),
    ]),
  );
  const rng = createRng();
  const stop = game.start({
    root: stage,
    audio,
    settings: getSettings(),
    rng,
    level: getLevel(game.id),
    finishRound: async () => {
      if (finished || !alive) return;
      finished = true;
      grow();
      addRound(game.id);
      root.dataset.roundDone = '1';
      audio.sfx('chime');
      await Promise.all([celebrate.big(), audio.play(rng.pick(PRAISE_IDS))]);
      if (alive) go('map');
    },
  });
  return () => {
    alive = false;
    stop();
    audio.stop();
  };
};
