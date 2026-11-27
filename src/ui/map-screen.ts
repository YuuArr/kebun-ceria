import { barnIcon, cottageIcon, flowerbedIcon, houseIcon, mindIcon, musicIcon, pondIcon } from '../art/areas';
import { cici } from '../art/cici';
import { h, s, svgRoot } from '../art/svg';
import { themeBackdrop, themeScene } from '../art/themes';
import * as celebrate from '../core/celebrate';
import { getGrowth, getSeason, getUnseen, harvest, isFull, markSeen, VISUAL_PER_ROUND } from '../core/garden';
import { go, type Screen } from '../core/router';
import { audio } from '../services';
import type { AreaId } from '../games/types';
import { createHoldButton } from './hold-button';
import { applyLayout, enableGardenTouch } from './garden-touch';
import { ciciWalker } from './cici-walker';
import { themeName as themeNameFor } from '../art/themes';

const AREAS: { id: AreaId; label: string; icon: () => SVGSVGElement }[] = [
  { id: 'huruf', label: 'Pondok Huruf', icon: houseIcon },
  { id: 'angka', label: 'Kolam Angka', icon: pondIcon },
  { id: 'warna', label: 'Taman Warna', icon: flowerbedIcon },
  { id: 'pikiran', label: 'Taman Pikiran', icon: mindIcon },
  { id: 'rumah', label: 'Rumah Cici', icon: cottageIcon },
  { id: 'musik', label: 'Panggung Musik', icon: musicIcon },
  { id: 'hewan', label: 'Kandang Hewan', icon: barnIcon },
];

export const mapScreen: Screen = (root, params) => {
  let alive = true;
  const growth = getGrowth();
  const { theme, cycle } = getSeason();
  // Animate at most the last 2 new rounds; older ones just appear (avoids long waits).
  const allUnseen = getUnseen();
  if (allUnseen.length > 2) markSeen(allUnseen[allUnseen.length - 3]);
  const unseenRounds = getUnseen();
  const firstHidden = unseenRounds.length ? (unseenRounds[0] - 1) * VISUAL_PER_ROUND + 1 : Infinity;
  const items = themeScene(theme, growth * VISUAL_PER_ROUND).map((it) => {
    if (it.stage >= firstHidden) it.el.classList.add('hidden-until-grow');
    return it.el;
  });
  const scene = s('g', { class: 'garden-scene', style: cycle ? `filter: hue-rotate(${(cycle * 47) % 360}deg)` : undefined }, [themeBackdrop(theme), ...items]);
  const garden = svgRoot('0 0 1000 560', [scene], {
    class: 'garden', preserveAspectRatio: 'xMidYMid slice', 'data-testid': 'garden', 'data-growth': growth, 'data-theme': theme,
  });
  garden.removeAttribute('aria-hidden');
  applyLayout(scene, getSeason().season);
  const stopTouch = enableGardenTouch(garden, scene, getSeason().season, audio);

  const areaButtons = AREAS.map((a) => {
    const b = h('button', { class: `area-button area-${a.id}`, type: 'button', 'aria-label': a.label, 'data-testid': `area-${a.id}` }, [a.icon(), h('span', { class: 'area-label' }, [a.label])]);
    b.addEventListener('click', async () => {
      b.classList.add('pressed');
      await audio.play(`area_${a.id}`);
      if (alive) go('area', { area: a.id });
    });
    return b;
  });

  const walker = ciciWalker(audio);
  const mascot = h('div', { class: 'map-cici-track' }, [walker.el]);
  const albumButton = h('button', { class: 'home-button album-button', type: 'button', 'aria-label': 'Album Kebun', 'data-testid': 'album-button' }, [
    svgRoot('0 0 64 64', [
      s('rect', { x: 12, y: 10, width: 40, height: 46, rx: 4, fill: '#E57373', stroke: '#4A3B3B', 'stroke-width': 3 }),
      s('rect', { x: 18, y: 16, width: 28, height: 20, rx: 2, fill: '#C5E1A5' }),
      s('circle', { cx: 26, cy: 26, r: 4, fill: '#FF8FB1' }), s('circle', { cx: 37, cy: 28, r: 4, fill: '#FDD835' }),
    ]),
  ]);
  albumButton.addEventListener('click', () => go('album'));
  root.append(
    h('div', { class: 'screen map-screen' }, [
      garden,
      mascot,
      h('nav', { class: 'area-panel', 'aria-label': 'Pilih tempat bermain' }, areaButtons),
      h('div', { class: 'corner-tr corner-row' }, [albumButton, createHoldButton(() => go('parent'))]),
    ]),
  );

  const showHarvest = async () => {
    const card = h('div', { class: 'harvest-card card', role: 'dialog', 'data-testid': 'harvest' }, [
      h('div', { class: 'card-mascot' }, [cici('cheer')]),
      h('h2', {}, ['Kebun penuh! Panen!']),
    ]);
    const overlay = h('div', { class: 'harvest-overlay' }, [card]);
    root.querySelector('.map-screen')?.append(overlay);
    void celebrate.big();
    await audio.play('panen');
    if (!alive) return;
    harvest();
    const next = getSeason().theme;
    const go2 = h('button', { class: 'btn-primary', type: 'button', 'data-testid': 'harvest-next' }, ['Ayo tanam lagi!']);
    card.append(h('p', {}, [`Kebunmu disimpan di Album. Sekarang: ${themeNameFor(next)}!`]), go2);
    go2.addEventListener('click', () => go('map'));
    await audio.play(`musim_${next}`);
  };

  // Reveal each new round's things quickly, then speak; a full garden is harvested.
  void (async () => {
    if (params.greet === '1' && unseenRounds.length === 0 && !isFull()) await audio.play('umum_halo');
    for (const round of unseenRounds) {
      for (let v = (round - 1) * VISUAL_PER_ROUND + 1; v <= round * VISUAL_PER_ROUND; v++) {
        if (!alive) return;
        const el = garden.querySelector(`[data-stage="${v}"]`);
        if (!el) continue;
        el.classList.remove('hidden-until-grow');
        el.classList.add('grow-in');
        audio.sfx('chime');
        await new Promise((r) => setTimeout(r, 260));
      }
      markSeen(round);
    }
    if (!alive) return;
    if (isFull()) {
      await new Promise((r) => setTimeout(r, 1500)); // let the child admire the full garden first
      if (!alive) return;
      await showHarvest();
      return;
    }
    await audio.play(unseenRounds.length ? 'umum_kebun_tumbuh' : 'umum_peta');
  })();

  return () => {
    alive = false;
    stopTouch();
    walker.stop();
    audio.stop();
  };
};
