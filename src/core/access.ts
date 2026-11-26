import { loadJSON, saveJSON } from './storage';

/** Gate in front of the games. Swap the implementation to move from a shared code to per-buyer codes. */
export interface AccessProvider {
  isUnlocked(): boolean;
  tryUnlock(code: string): Promise<boolean>;
}

interface AccessRecord {
  unlocked: true;
  at: string;
}

const KEY = 'access';

/** Uppercase, drop whitespace and dashes so "ceria-20 26" equals "CERIA2026". */
export function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(/[\s-]+/g, '');
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Option C: one code for every buyer. Only hashes are shipped. A device that unlocked once
 * stays unlocked even after the code is rotated.
 */
export function createSharedCodeAccess(validHashes: readonly string[]): AccessProvider {
  // Session memory keeps the app usable when storage is unavailable.
  let unlockedThisSession = false;
  return {
    isUnlocked() {
      return unlockedThisSession || loadJSON<AccessRecord | null>(KEY, null)?.unlocked === true;
    },
    async tryUnlock(code) {
      const normalized = normalizeCode(code);
      if (!normalized) return false;
      const hash = await sha256Hex(normalized);
      if (!validHashes.includes(hash)) return false;
      unlockedThisSession = true;
      saveJSON(KEY, { unlocked: true, at: new Date().toISOString() } satisfies AccessRecord);
      return true;
    },
  };
}
