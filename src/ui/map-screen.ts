import { flowerbedIcon, houseIcon, pondIcon } from '../art/areas';
import { cici } from '../art/cici';
import { GARDEN_ITEMS, gardenBackdrop, gardenItem } from '../art/garden-items';
import { h, svgRoot } from '../art/svg';
import { getGrowth, getUnseen, markSeen } from '../core/garden';
import { go, type Screen } from '../core/router';
import { audio } from '../services';
import type { AreaId } from '../games/types';
import { createHoldButton } from './hold-button';

const AREAS: { id: AreaId; label: string; icon: () => SVGSVGElement }[] = [
  { id: 'huruf', label: 'Pondok Huruf', icon: houseIcon },
  { id: 'angka', label: 'Kolam Angka', icon: pondIcon },
  { id: 'warna', label: 'Taman Warna', icon: flowerbedIcon },
];

export const mapScreen: Screen = (root, params) => {
  let alive = true;
  const growth = getGrowth();
  const unseen = new Set(getUnseen());
  const items = GARDEN_ITEMS.filter((i) => i.stage <= growth)
    .sort((a, b) => (a.kind === 'rainbow' ? -1 : b.kind === 'rainbow' ? 1 : a.y - b.y))
    .map((i) => {
      const g = gardenItem(i);
      if (unseen.has(i.stage)) g.classList.add('hidden-until-grow');
      return g;
    });
  const garden = svgRoot('0 0 1000 560', [gardenBackdrop(), ...items], { class: 'garden', preserveAspectRatio: 'xMidYMid slice', 'data-testid': 'garden', 'data-growth': growth });

  const areaButtons = AREAS.map((a) => {
    const b = h('button', { class: `area-button area-${a.id}`, type: 'button', 'aria-label': a.label, 'data-testid': `area-${a.id}` }, [a.icon()]);
    b.addEventListener('click', async () => {
      b.classList.add('pressed');
      await audio.play(`area_${a.id}`);
      if (alive) go('area', { area: a.id });
    });
    return b;
  });

  const mascot = h('div', { class: 'map-mascot' }, [cici()]);
  root.append(
    h('div', { class: 'screen map-screen' }, [
      garden,
      mascot,
      h('nav', { class: 'area-row' }, areaButtons),
      h('div', { class: 'corner-tr' }, [createHoldButton(() => go('parent'))]),
    ]),
  );

  // Reveal new growth one by one, then speak.
  void (async () => {
    const newStages = [...unseen].sort((a, b) => a - b);
    if (params.greet === '1' && newStages.length === 0) {
      await audio.play('umum_halo');
    }
    for (const stage of newStages) {
      if (!alive) return;
      const el = garden.querySelector(`[data-stage="${stage}"]`);
      el?.classList.remove('hidden-until-grow');
      el?.classList.add('grow-in');
      audio.sfx('chime');
      markSeen(stage);
      await new Promise((r) => setTimeout(r, 700));
    }
    if (!alive) return;
    await audio.play(newStages.length ? 'umum_kebun_tumbuh' : 'umum_peta');
  })();

  return () => {
    alive = false;
    audio.stop();
  };
};
