import { earIcon } from '../../art/areas';
import { cici } from '../../art/cici';
import { gardenArt } from '../../art/garden-items';
import { h, s, svgRoot } from '../../art/svg';
import { thing, type ArtId } from '../../art/things';
import { onTap } from '../../core/tap';
import { STORIES, type StoryPage, type StoryThing } from '../../content/stories';
import type { GameContext } from '../types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function artFor(t: StoryThing): Element {
  if (t.art === 'cici') return cici('happy');
  if (t.art === 'pohon') return gardenArt('tree');
  if (t.art === 'bunga') return gardenArt('flower', '#FF8FB1');
  return thing(t.art as ArtId);
}

/** Cerita Bergambar: a short read-along story; words light up as the narrator reads, objects react to taps. */
export function startCerita(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  let token = 0;
  const story = rng.pick(STORIES);
  let index = 0;
  const scene = h('div', { class: 'story-scene', 'data-testid': 'story-scene' });
  const sentence = h('p', { class: 'story-text', 'data-testid': 'story-text' });
  const next = h('button', { class: 'next-button', type: 'button', 'aria-label': 'Halaman berikutnya', 'data-testid': 'story-next' }, [
    svgRoot('0 0 64 64', [s('path', { d: 'M22 14 L46 32 L22 50', fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]),
  ]);
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Baca lagi' }, [earIcon()]);
  root.append(h('div', { class: 'story-layout' }, [scene, h('div', { class: 'story-bottom' }, [sentence, next])]), h('div', { class: 'corner-tr' }, [ear]));

  const read = async (page: StoryPage, n: number) => {
    const my = ++token;
    const words = [...sentence.querySelectorAll('span')];
    words.forEach((w) => w.classList.remove('lit'));
    const said = audio.play(`cerita_${story.id}_${n}`);
    for (const w of words) {
      if (my !== token || !alive) return;
      w.classList.add('lit');
      await wait(Math.max(380, (w.textContent?.length ?? 3) * 110));
    }
    await said;
    if (my === token) next.classList.add('ready');
    void page;
  };

  const show = () => {
    const page = story.pages[index];
    next.classList.remove('ready');
    scene.style.background = `linear-gradient(${page.sky} 0 64%, ${page.ground} 64%)`;
    scene.replaceChildren(
      ...page.things.map((t) => {
        const el = h('button', {
          class: `story-thing motion-${t.motion}`, type: 'button', 'aria-label': t.art,
          style: `left:${(t.x / 400) * 100}%;top:${(t.y / 240) * 100}%;width:${(t.size / 400) * 100}%`,
        }, [artFor(t)]);
        onTap(el, () => {
          el.classList.remove('play');
          void el.offsetWidth;
          el.classList.add('play');
          audio.sfx(t.sfx);
        });
        return el;
      }),
    );
    sentence.replaceChildren(...page.text.split(/\s+/).flatMap((w, i) => [i ? ' ' : '', h('span', {}, [w])]));
    void read(page, index + 1);
  };

  ear.addEventListener('click', () => void read(story.pages[index], index + 1));
  next.addEventListener('click', () => {
    if (!next.classList.contains('ready') || !alive) return;
    audio.sfx('tap');
    index++;
    if (index >= story.pages.length) {
      next.classList.remove('ready');
      ctx.finishRound();
      return;
    }
    show();
  });
  show();
  return () => {
    alive = false;
    token++;
  };
}
