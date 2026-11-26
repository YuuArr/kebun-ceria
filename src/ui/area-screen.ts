import { h } from '../art/svg';
import { go, type Screen } from '../core/router';
import { gamesIn } from '../games/registry';
import type { AreaId } from '../games/types';
import { audio } from '../services';
import { homeButton } from './home-button';

export const areaScreen: Screen = (root, params) => {
  const area = (params.area ?? 'angka') as AreaId;
  const tiles = gamesIn(area).map((g) => {
    const b = h('button', { class: 'game-tile', type: 'button', 'aria-label': g.name, 'data-testid': `game-${g.id}` }, [g.icon()]);
    b.addEventListener('click', () => go('game', { id: g.id, area }));
    return b;
  });
  root.append(
    h('div', { class: `screen area-screen bg-${area}` }, [
      h('div', { class: 'corner-tl' }, [homeButton(() => go('map'))]),
      h('div', { class: `tile-row${tiles.length > 4 ? ' many' : ''}` }, tiles),
    ]),
  );
  void audio.play('umum_pilih_game');
  return () => audio.stop();
};
