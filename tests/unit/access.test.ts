import { beforeEach, describe, expect, it } from 'vitest';
import { createSharedCodeAccess, normalizeCode, sha256Hex } from '../../src/core/access';
import { ACCESS_HASHES } from '../../src/config';

beforeEach(() => localStorage.clear());

describe('access', () => {
  it('normalizes case, spaces and dashes', () => {
    expect(normalizeCode(' ceria-20 26 ')).toBe('CERIA2026');
  });

  it('unlocks with a loosely typed correct code', async () => {
    const a = createSharedCodeAccess([await sha256Hex('CERIA2026')]);
    expect(a.isUnlocked()).toBe(false);
    expect(await a.tryUnlock('ceria 2026')).toBe(true);
    expect(a.isUnlocked()).toBe(true);
  });

  it('rejects wrong codes without lockout', async () => {
    const a = createSharedCodeAccess([await sha256Hex('CERIA2026')]);
    for (let i = 0; i < 20; i++) expect(await a.tryUnlock('SALAH')).toBe(false);
    expect(a.isUnlocked()).toBe(false);
    expect(await a.tryUnlock('CERIA-2026')).toBe(true);
  });

  it('keeps old devices unlocked after the code is rotated', async () => {
    await createSharedCodeAccess([await sha256Hex('LAMA')]).tryUnlock('lama');
    const rotated = createSharedCodeAccess([await sha256Hex('BARU')]);
    expect(rotated.isUnlocked()).toBe(true);
  });

  it('ships the dev code hash in config', async () => {
    expect(ACCESS_HASHES).toContain(await sha256Hex('CERIA2026'));
  });
});
