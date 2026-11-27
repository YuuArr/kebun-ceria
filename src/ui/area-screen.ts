import { backdrop } from '../art/backdrops';
import { h } from '../art/svg';
import { go, type Screen } from '../core/router';
import { gamesIn } from '../games/registry';
import type { AreaId } from '../games/types';
import { audio } from '../services';
import { homeButton } from './home-button';

const AREA_NAMES: Record<AreaId, string> = {
  angka: 'Kolam Angka', warna: 'Taman Warna', huruf: 'Pondok Huruf', pikiran: 'Taman Pikiran', rumah: 'Rumah Cici', musik: 'Panggung Musik', hewan: 'Kandang Hewan',
};

export const areaScreen: Screen = (root, params) => {
  const area = (params.area ?? 'angka') as AreaId;
  const tiles = gamesIn(area).map((g) => {
    const b = h('button', { class: 'game-tile', type: 'button', 'aria-label': g.name, 'data-testid': `game-${g.id}` }, [
      h('span', { class: 'tile-art' }, [g.icon()]),
      h('span', { class: 'tile-name' }, [g.name]),
    ]);
    b.addEventListener('click', () => go('game', { id: g.id, area }));
    return b;
  });
  root.append(
    h('div', { class: `screen area-screen bg-${area}` }, [
      backdrop(area),
      h('div', { class: 'corner-tl' }, [homeButton(() => go('map'))]),
      h('h2', { class: 'area-title' }, [AREA_NAMES[area]]),
      h('div', { class: `tile-row${tiles.length > 4 ? ' many' : ''}` }, tiles),
    ]),
  );
  void audio.play('umum_pilih_game');
  return () => audio.stop();
};
