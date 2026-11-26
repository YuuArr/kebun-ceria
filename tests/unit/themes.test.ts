import { describe, expect, it } from 'vitest';
import { THEME_DEFS, themeBackdrop, themeScene } from '../../src/art/themes';
import { THEMES } from '../../src/core/garden';

describe('garden themes', () => {
  it('every new theme has 40 things and 40 decorations', () => {
    for (const def of Object.values(THEME_DEFS)) {
      expect(def.base).toHaveLength(40);
      expect(def.decor).toHaveLength(40);
    }
  });
  it('each visual step appears exactly once and the full garden has 80 things', () => {
    for (const t of THEMES) {
      expect(themeScene(t, 0)).toHaveLength(0);
      expect(themeScene(t, 120)).toHaveLength(80);
      for (let v = 1; v <= 120; v++) {
        const stages = themeScene(t, v).map((i) => i.stage);
        expect(stages, `${t} ${v}`).toContain(v);
        expect(new Set(stages).size).toBe(stages.length);
      }
      expect(themeBackdrop(t).tagName).toBe('g');
    }
  }, 30_000);
});
