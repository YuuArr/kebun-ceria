import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHoldButton } from '../../src/ui/hold-button';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const down = (el: Element) => el.dispatchEvent(new Event('pointerdown'));
const up = (el: Element) => el.dispatchEvent(new Event('pointerup'));

describe('hold button', () => {
  it('activates after 3000 ms, not before', () => {
    const fn = vi.fn();
    const b = createHoldButton(fn);
    down(b);
    vi.advanceTimersByTime(2999);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledOnce();
  });
  it('cancels when released early', () => {
    const fn = vi.fn();
    const b = createHoldButton(fn);
    down(b);
    vi.advanceTimersByTime(1500);
    up(b);
    vi.advanceTimersByTime(3000);
    expect(fn).not.toHaveBeenCalled();
  });
});
