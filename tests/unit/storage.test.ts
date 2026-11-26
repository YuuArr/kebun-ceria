import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadJSON, saveJSON } from '../../src/core/storage';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('storage', () => {
  it('round-trips JSON under a kc: prefix', () => {
    expect(saveJSON('a', { x: 1 })).toBe(true);
    expect(loadJSON('a', null)).toEqual({ x: 1 });
    expect(localStorage.getItem('kc:a')).toBe('{"x":1}');
  });

  it('returns fallback for corrupt JSON', () => {
    localStorage.setItem('kc:b', '{oops');
    expect(loadJSON('b', 5)).toBe(5);
  });

  it('never throws when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    expect(saveJSON('c', 1)).toBe(false);
    expect(loadJSON('c', 'fb')).toBe('fb');
  });
});
