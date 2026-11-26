/**
 * SHA-256 hashes of valid access codes (after normalizeCode).
 * Make a new one with: npm run kode -- KODE-BARU
 * Keep old hashes while you still sell with the old code; devices that already unlocked stay unlocked.
 */
export const ACCESS_HASHES: readonly string[] = [
  // CERIA2026 (development code — replace before selling)
  '1af98460877fafa7cbd46f23dda5810674e249a4d61615451dc762984b8d87e5',
];

export const APP_VERSION = '0.1.0';
