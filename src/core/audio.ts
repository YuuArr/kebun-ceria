import { line } from '../content/lines';
import { getSettings } from './settings';

/** The subset of Howler's Howl we use (lets tests inject a fake). */
export interface HowlLike {
  play(): number;
  stop(): unknown;
  volume(v: number): unknown;
}
export type HowlCtor = new (opts: {
  src: string[];
  html5?: boolean;
  preload?: boolean;
  onend?: () => void;
  onloaderror?: () => void;
  onplayerror?: () => void;
}) => HowlLike;

export type Sfx = 'pop' | 'boing' | 'splash' | 'chime' | 'tap';

export interface AudioService {
  /** Call from the first user gesture (iOS needs it before any sound). */
  unlock(): void;
  /** Plays a voice line; resolves when it ends, falls back, or after 8 s at most. */
  play(id: string): Promise<void>;
  /** Short synthesized sound effect; never blocks. */
  sfx(name: Sfx): void;
  stop(): void;
}

interface Options {
  Howl: HowlCtor;
  speech?: SpeechSynthesis | null;
  base?: string;
  /** Ids that have a recorded mp3. When given, other ids go straight to the built-in voice. */
  available?: ReadonlySet<string>;
}

const GOOD_VOICE = /google|damayanti|gadis|ardi/i;
const BEST_VOICE = /natural|neural|premium|enhanced/i;

/** Best Indonesian built-in voice: id-ID over other id variants, known good engines first; online-only voices only when online. */
export function pickVoice(voices: readonly SpeechSynthesisVoice[], online: boolean): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of voices) {
    const lang = v.lang.replace('_', '-').toLowerCase();
    if (!lang.startsWith('id') && !lang.startsWith('in')) continue;
    if (!online && v.localService === false) continue;
    const score = (lang === 'id-id' ? 2 : 1) + (BEST_VOICE.test(v.name) ? 5 : GOOD_VOICE.test(v.name) ? 4 : 0);
    if (score > bestScore) {
      best = v;
      bestScore = score;
    }
  }
  return best;
}

const MAX_WAIT_MS = 8000;

export function createAudio({ Howl, speech = globalThis.speechSynthesis ?? null, base = '/', available }: Options): AudioService {
  const howls = new Map<string, HowlLike>();
  const missing = new Set<string>();
  /** Finisher of the voice line currently playing. */
  let finishCurrent: (() => void) | null = null;
  let currentHowl: HowlLike | null = null;
  let ctx: AudioContext | null = null;

  const stopVoice = () => {
    currentHowl?.stop();
    currentHowl = null;
    speech?.cancel();
    const f = finishCurrent;
    finishCurrent = null;
    f?.();
  };

  const speak = (id: string, finish: () => void) => {
    const l = line(id);
    const text = l.tts ?? l.text;
    if (!speech) {
      setTimeout(finish, Math.min(3000, text.length * 60));
      return;
    }
    const u = makeUtterance(text);
    u.lang = 'id-ID';
    try {
      const voice = pickVoice(speech.getVoices?.() ?? [], typeof navigator === 'undefined' || navigator.onLine !== false);
      if (voice) (u as unknown as SpeechSynthesisUtterance).voice = voice;
    } catch { /* keep default voice */ }
    // A little slower and brighter: easier for small children to follow.
    u.rate = 0.85;
    u.pitch = 1.1;
    u.volume = getSettings().voice;
    u.onend = finish;
    u.onerror = finish;
    speech.speak(u as SpeechSynthesisUtterance);
  };

  const getHowl = (id: string): HowlLike => {
    let h = howls.get(id);
    if (!h) {
      h = new Howl({
        src: [`${base}audio/${id}.mp3`],
        preload: true,
        onend: () => { if (currentHowl === h) finishCurrent?.(); },
        onloaderror: () => {
          missing.add(id);
          howls.delete(id);
          if (currentHowl === h) {
            currentHowl = null;
            const f = finishCurrent;
            if (f) speak(id, f);
          }
        },
        onplayerror: () => { if (currentHowl === h) finishCurrent?.(); },
      });
      howls.set(id, h);
    }
    return h;
  };

  return {
    unlock() {
      try {
        ctx ??= new AudioContext();
        void ctx.resume();
      } catch { /* no Web Audio */ }
      try {
        speech?.getVoices?.(); // start loading the voice list early (Chrome loads it lazily)
        if (speech && typeof SpeechSynthesisUtterance !== 'undefined') speech.speak(new SpeechSynthesisUtterance(''));
      } catch { /* ignore */ }
    },

    play(id) {
      line(id); // fail fast on unknown ids
      stopVoice();
      return new Promise<void>((resolve) => {
        let settled = false;
        const timer = setTimeout(() => finish(), MAX_WAIT_MS);
        const finish = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (finishCurrent === finish) { finishCurrent = null; currentHowl = null; }
          resolve();
        };
        finishCurrent = finish;
        if (missing.has(id) || (available && !available.has(id))) {
          speak(id, finish);
          return;
        }
        const h = getHowl(id);
        currentHowl = h;
        h.volume(getSettings().voice);
        h.play();
      });
    },

    sfx(name) {
      try {
        ctx ??= new AudioContext();
        playSynth(ctx, name, getSettings().sfx);
      } catch { /* no Web Audio: stay silent */ }
    },

    stop: stopVoice,
  };
}

interface UtteranceLike {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

function makeUtterance(text: string): UtteranceLike {
  if (typeof SpeechSynthesisUtterance !== 'undefined') {
    return new SpeechSynthesisUtterance(text) as unknown as UtteranceLike;
  }
  return { text, lang: '', rate: 1, pitch: 1, volume: 1, onend: null, onerror: null };
}

/** Tiny synthesized effects so the game needs no sfx files. */
function playSynth(ctx: AudioContext, name: Sfx, volume: number) {
  if (volume <= 0) return;
  const t = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  const osc = ctx.createOscillator();
  osc.connect(gain);
  const v = 0.25 * volume;
  const env = (attack: number, release: number) => {
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(v, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  };
  switch (name) {
    case 'pop':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
      env(0.005, 0.12);
      break;
    case 'boing':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(330, t + 0.1);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.3);
      env(0.01, 0.3);
      break;
    case 'splash':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.2);
      env(0.005, 0.22);
      break;
    case 'chime': {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, t);
      osc.frequency.setValueAtTime(880, t + 0.12);
      osc.frequency.setValueAtTime(1320, t + 0.24);
      env(0.01, 0.5);
      break;
    }
    case 'tap':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, t);
      env(0.003, 0.06);
      break;
  }
  osc.start(t);
  osc.stop(t + 0.7);
}
