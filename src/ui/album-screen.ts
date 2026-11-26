import { h, s, svgRoot } from '../art/svg';
import { themeBackdrop, themeName, themeScene } from '../art/themes';
import { getAlbum, getGrowth, getSeason, GARDEN_STAGES, VISUAL_PER_ROUND, type ThemeId } from '../core/garden';
import { go, type Screen } from '../core/router';
import { homeButton } from './home-button';

function miniGarden(theme: ThemeId, cycle: number, visual: number): SVGSVGElement {
  return svgRoot('0 0 1000 560', [
    s('g', { style: cycle ? `filter: hue-rotate(${(cycle * 47) % 360}deg)` : undefined }, [themeBackdrop(theme), ...themeScene(theme, visual).map((i) => i.el)]),
  ], { preserveAspectRatio: 'xMidYMid slice' });
}

/** Album Kebun: every finished garden, plus the one growing now. */
export const albumScreen: Screen = (root) => {
  const album = getAlbum();
  const { theme, cycle } = getSeason();
  const pages = [
    ...album.map((a, i) =>
      h('figure', { class: 'album-page', 'data-testid': 'album-page' }, [
        miniGarden(a.theme, a.cycle, GARDEN_STAGES * VISUAL_PER_ROUND),
        h('figcaption', {}, [`${i + 1}. ${themeName(a.theme)}`]),
      ]),
    ),
    h('figure', { class: 'album-page current' }, [
      miniGarden(theme, cycle, getGrowth() * VISUAL_PER_ROUND),
      h('figcaption', {}, [`Sekarang: ${themeName(theme)} (${getGrowth()}/${GARDEN_STAGES})`]),
    ]),
  ];
  root.append(
    h('div', { class: 'screen album-screen' }, [
      h('div', { class: 'corner-tl' }, [homeButton(() => go('map'))]),
      h('h2', { class: 'album-title' }, ['Album Kebun']),
      h('div', { class: 'album-grid' }, pages),
    ]),
  );
  return () => {};
};
