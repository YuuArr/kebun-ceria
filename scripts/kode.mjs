// Usage: npm run kode -- KODE-BARU
// Prints the normalized code and its SHA-256 hash for src/config.ts.
import { createHash } from 'node:crypto';

const raw = process.argv.slice(2).join(' ');
if (!raw.trim()) {
  console.error('Pakai: npm run kode -- KODE-BARU');
  process.exit(1);
}
const code = raw.toUpperCase().replace(/[\s-]+/g, '');
const hash = createHash('sha256').update(code).digest('hex');
console.log(`Kode (yang dicek): ${code}`);
console.log(`Hash: ${hash}`);
console.log('\nTambahkan baris ini ke ACCESS_HASHES di src/config.ts:');
console.log(`  // ${code}\n  '${hash}',`);
