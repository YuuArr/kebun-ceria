import { beforeEach, describe, expect, it } from 'vitest';
import { getSettings, updateSettings } from '../../src/core/settings';

beforeEach(() => localStorage.clear());

describe('settings', () => {
  it('has defaults when storage is empty', () => {
    expect(getSettings()).toEqual({ age: '4-5', letters: 'bertahap', music: 0.4, voice: 1, sfx: 0.8 });
  });
  it('persists updates', () => {
    updateSettings({ age: '2-3' });
    expect(getSettings().age).toBe('2-3');
  });
  it('falls back on invalid stored values', () => {
    localStorage.setItem('kc:settings', JSON.stringify({ age: '9-10', voice: 7 }));
    const s = getSettings();
    expect(s.age).toBe('4-5');
    expect(s.voice).toBe(1);
  });
});
