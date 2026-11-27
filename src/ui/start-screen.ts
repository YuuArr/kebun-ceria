import { cici } from '../art/cici';
import { backdrop } from '../art/backdrops';
import { h, s } from '../art/svg';
import { go, type Screen } from '../core/router';
import { access, audio } from '../services';
import { preferLandscape } from '../core/orientation';

export const startScreen: Screen = (root) => {
  const play = h('button', { class: 'play-button', type: 'button', 'aria-label': 'Mulai main', 'data-testid': 'play-button' }, [
    s('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' }, [s('path', { d: 'M22 14 L52 32 L22 50 Z', fill: '#fff' })]),
  ]);
  play.addEventListener('click', () => {
    audio.unlock();
    void preferLandscape();
    go(access.isUnlocked() ? 'map' : 'access', { greet: '1' });
  });
  root.append(
    h('div', { class: 'screen start-screen' }, [
      backdrop('warna'),
      h('div', { class: 'start-mascot' }, [cici('cheer')]),
      h('h1', { class: 'logo' }, ['Kebun ', h('span', {}, ['Ceria'])]),
      play,
    ]),
  );
  return () => {};
};
