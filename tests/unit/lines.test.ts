import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LINES, line } from '../../src/content/lines';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.ts') ? [p] : [];
  });
}

describe('voice lines', () => {
  it('ids are unique snake_case', () => {
    const ids = LINES.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9_]+$/);
  });
  it('every literal id played in src exists', () => {
    for (const f of files('src')) {
      for (const m of readFileSync(f, 'utf8').matchAll(/play\('([a-z0-9_]+)'/g)) {
        expect(() => line(m[1]), `${f}: ${m[1]}`).not.toThrow();
      }
    }
  });
});
