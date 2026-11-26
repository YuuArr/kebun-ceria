import { earIcon } from '../../art/areas';
import { h, s, svgRoot } from '../../art/svg';
import * as celebrate from '../../core/celebrate';
import { onTap } from '../../core/tap';
import { PRAISE_IDS } from '../../content/lines';
import type { GameContext } from '../types';
import { wait } from '../shared/choice';
import { MIX_HEX, makeMixRound, mix, type MixColor, type Primary } from './logic';

const PRIMARIES: Primary[] = ['merah', 'kuning', 'biru'];

function bowl(fill: string): SVGSVGElement {
  return svgRoot('0 0 160 110', [
    s('ellipse', { cx: 80, cy: 34, rx: 70, ry: 20, fill, class: 'bowl-paint', stroke: '#4A3B3B', 'stroke-width': 4 }),
    s('path', { d: 'M10 34 Q14 104 80 104 Q146 104 150 34 Q140 54 80 54 Q20 54 10 34 Z', fill: '#90CAF9', stroke: '#4A3B3B', 'stroke-width': 4, 'stroke-linejoin': 'round' }),
  ]);
}

/** Campur Warna: pour two colours into the magic bowl and see what you get. */
export function startCampur(ctx: GameContext): () => void {
  const { root, audio, rng } = ctx;
  let alive = true;
  const round = makeMixRound(ctx.settings.age, rng);
  const bowlWrap = h('div', { class: 'mix-bowl', 'data-testid': 'mix-bowl' }, [bowl('#fff')]);
  const goal = h('div', { class: 'mix-goal', 'data-testid': 'mix-goal' });
  const pots = PRIMARIES.map((c) => h('button', { class: 'paint-pot', type: 'button', 'data-color': c, 'data-testid': `pot-${c}`, style: `--c:${MIX_HEX[c]}`, 'aria-label': c }));
  const ear = h('button', { class: 'ear-button', type: 'button', 'aria-label': 'Dengar lagi' }, [earIcon()]);
  let prompt = round.mode === 'bebas' ? 'campur_bebas' : `campur_ajak_${round.targets[0]}`;
  ear.addEventListener('click', () => void audio.play(prompt));
  root.append(h('div', { class: 'campur-layout' }, [goal, bowlWrap, h('div', { class: 'pot-row' }, pots)]), h('div', { class: 'corner-tr' }, [ear]));
  const paint = bowlWrap.querySelector('.bowl-paint')!;
  const setBowl = (c: string) => paint.setAttribute('fill', c);

  let picked: Primary[] = [];
  let busy = false;
  let step = 0;
  const total = round.mode === 'bebas' ? 3 : round.targets.length;
  const showGoal = () => {
    if (round.mode === 'bebas') { goal.replaceChildren(); return; }
    const t = round.targets[step];
    goal.replaceChildren(h('span', { class: 'goal-dot', style: `--c:${MIX_HEX[t]}` }), h('span', {}, ['?']));
    goal.dataset.target = t;
    prompt = `campur_ajak_${t}`;
    void audio.play(prompt);
  };

  pots.forEach((pot) => onTap(pot, async () => {
    if (busy || !alive) return;
    const c = pot.dataset.color as Primary;
    audio.sfx('splash');
    picked.push(c);
    pot.classList.add('poured');
    if (picked.length === 1) {
      setBowl(MIX_HEX[c]);
      void audio.play(`warna_${c}`);
      return;
    }
    busy = true;
    const result: MixColor = mix(picked[0], picked[1]);
    setBowl(MIX_HEX[result]);
    bowlWrap.classList.add('swirl');
    const r = bowlWrap.getBoundingClientRect();
    celebrate.splash({ x: r.left + r.width / 2, y: r.top + r.height / 3 }, MIX_HEX[result]);
    await audio.play(`warna_${result}`);
    const success = round.mode === 'bebas' || result === round.targets[step];
    if (success) {
      celebrate.stars({ x: r.left + r.width / 2, y: r.top });
      await audio.play(rng.pick(PRAISE_IDS));
      step++;
    } else {
      await audio.play('campur_coba_lagi');
    }
    await wait(400);
    picked = [];
    pots.forEach((p) => p.classList.remove('poured'));
    bowlWrap.classList.remove('swirl');
    setBowl('#fff');
    busy = false;
    if (step >= total) {
      if (alive) ctx.finishRound();
      return;
    }
    if (success) showGoal();
  }));

  if (round.mode === 'bebas') void audio.play('campur_bebas');
  showGoal();
  return () => { alive = false; };
}
