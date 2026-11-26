// Writes audio/naskah.csv: every narrator line the owner must record as public/audio/<id>.mp3.
import { writeFileSync } from 'node:fs';
import { LINES } from '../src/content/lines';

const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
const rows = [['id', 'teks', 'catatan'], ...LINES.map((l) => [l.id, l.text, l.note ?? ''])];
writeFileSync('audio/naskah.csv', '﻿' + rows.map((r) => r.map(q).join(',')).join('\n') + '\n', 'utf8');
console.log(`audio/naskah.csv: ${LINES.length} baris suara`);
