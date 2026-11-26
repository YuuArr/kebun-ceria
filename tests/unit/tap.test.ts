import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onTapOnce } from '../../src/core/tap';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('onTapOnce', () => {
  it('fires once for a fast double tap', () => {
    const el = document.createElement('div');
    const fn = vi.fn();
    onTapOnce(el, fn);
    el.dispatchEvent(new Event('pointerdown'));
    vi.advanceTimersByTime(50);
    el.dispatchEvent(new Event('pointerdown'));
    expect(fn).toHaveBeenCalledOnce();
  });
  it('can be re-armed, ignoring taps within 250 ms', () => {
    const el = document.createElement('div');
    const fn = vi.fn();
    const rearm = onTapOnce(el, fn);
    el.dispatchEvent(new Event('pointerdown'));
    rearm();
    el.dispatchEvent(new Event('pointerdown'));
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(300);
    el.dispatchEvent(new Event('pointerdown'));
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
