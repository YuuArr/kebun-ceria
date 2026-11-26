import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAudio, type HowlLike } from '../../src/core/audio';

type Opts = { src: string[]; onend?: () => void; onloaderror?: () => void; onplayerror?: () => void };
let howls: FakeHowl[] = [];
class FakeHowl implements HowlLike {
  opts: Opts;
  playing = false;
  stopped = 0;
  constructor(o: Opts) { this.opts = o; howls.push(this); }
  play() { this.playing = true; return 1; }
  stop() { this.stopped++; this.playing = false; return this; }
  volume() { return this; }
  state() { return 'loaded' as const; }
}

function fakeSpeech() {
  const spoken: { text: string; lang: string }[] = [];
  return {
    spoken,
    speech: {
      speak: (u: { text: string; lang: string; onend: () => void }) => { spoken.push({ text: u.text, lang: u.lang }); setTimeout(() => u.onend(), 10); },
      cancel: vi.fn(),
    },
  };
}

beforeEach(() => { howls = []; vi.useFakeTimers(); });
afterEach(() => vi.useRealTimers());

describe('audio', () => {
  it('plays the mp3 and resolves on end', async () => {
    const a = createAudio({ Howl: FakeHowl, speech: null, base: '/b/' });
    let done = false;
    const p = a.play('pujian_1').then(() => { done = true; });
    expect(howls[0].opts.src).toEqual(['/b/audio/pujian_1.mp3']);
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toBe(false);
    howls[0].opts.onend!();
    await p;
    expect(done).toBe(true);
  });

  it('falls back to id-ID speech when the file is missing', async () => {
    const s = fakeSpeech();
    const a = createAudio({ Howl: FakeHowl, speech: s.speech as never, base: '/' });
    const p = a.play('huruf_bunyi_b');
    howls[0].opts.onloaderror!();
    await vi.advanceTimersByTimeAsync(20);
    await p;
    expect(s.spoken).toEqual([{ text: 'beh', lang: 'id-ID' }]);
  });

  it('resolves silently when no speech engine exists', async () => {
    const a = createAudio({ Howl: FakeHowl, speech: null, base: '/' });
    const p = a.play('pujian_6');
    howls[0].opts.onloaderror!();
    await vi.advanceTimersByTimeAsync(3000);
    await expect(p).resolves.toBeUndefined();
  });

  it('never hangs longer than 8 s', async () => {
    const a = createAudio({ Howl: FakeHowl, speech: null, base: '/' });
    const p = a.play('umum_halo');
    await vi.advanceTimersByTimeAsync(8000);
    await expect(p).resolves.toBeUndefined();
  });

  it('a new voice line stops the previous one', async () => {
    const a = createAudio({ Howl: FakeHowl, speech: null, base: '/' });
    void a.play('pujian_1');
    void a.play('pujian_2');
    expect(howls[0].stopped).toBeGreaterThan(0);
  });

  it('remembers missing files and skips straight to fallback', async () => {
    const a = createAudio({ Howl: FakeHowl, speech: null, base: '/' });
    void a.play('pujian_3');
    howls[0].opts.onloaderror!();
    void a.play('pujian_3');
    expect(howls.length).toBe(1);
  });
});

describe('built-in voice choice', () => {
  const v = (name: string, lang: string, localService = true) => ({ name, lang, localService }) as SpeechSynthesisVoice;
  it('prefers a good Indonesian voice', async () => {
    const { pickVoice } = await import('../../src/core/audio');
    const voices = [v('English', 'en-US'), v('Bahasa Indonesia', 'id-ID'), v('Google Bahasa Indonesia', 'id-ID')];
    expect(pickVoice(voices, true)?.name).toBe('Google Bahasa Indonesia');
  });
  it('skips online-only voices when offline', async () => {
    const { pickVoice } = await import('../../src/core/audio');
    const voices = [v('Microsoft Gadis Online (Natural)', 'id-ID', false), v('Damayanti', 'id-ID')];
    expect(pickVoice(voices, false)?.name).toBe('Damayanti');
    expect(pickVoice(voices, true)?.name).toBe('Microsoft Gadis Online (Natural)');
  });
  it('returns null when there is no Indonesian voice', async () => {
    const { pickVoice } = await import('../../src/core/audio');
    expect(pickVoice([v('English', 'en-US')], true)).toBeNull();
  });
});

describe('available audio list', () => {
  it('skips straight to speech for lines without a recorded file', async () => {
    const s = fakeSpeech();
    const a = createAudio({ Howl: FakeHowl, speech: s.speech as never, base: '/', available: new Set(['pujian_1']) });
    const p = a.play('pujian_2');
    expect(howls).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(20);
    await p;
    expect(s.spoken[0].text).toBe('Pintar sekali!');
    void a.play('pujian_1');
    expect(howls).toHaveLength(1);
  });
});
