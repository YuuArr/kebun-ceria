import { beforeEach, describe, expect, it } from 'vitest';
import { addRound, getLevel, getRounds, MAX_LEVEL, ROUNDS_PER_LEVEL, _resetProgressMemory } from '../../src/core/progress';

beforeEach(() => { localStorage.clear(); _resetProgressMemory(); });

describe('progress / levels', () => {
  it('starts at level 0 and rises every 3 rounds, capped at 3', () => {
    expect(ROUNDS_PER_LEVEL).toBe(3);
    expect(MAX_LEVEL).toBe(3);
    expect(getLevel('hitung')).toBe(0);
    for (let i = 1; i <= 20; i++) {
      addRound('hitung');
      expect(getLevel('hitung')).toBe(Math.min(3, Math.floor(i / 3)));
    }
    expect(getRounds('hitung')).toBe(20);
  });
  it('is tracked per game and never goes down', () => {
    for (let i = 0; i < 6; i++) addRound('monyet');
    expect(getLevel('monyet')).toBe(2);
    expect(getLevel('kuas')).toBe(0);
  });
  it('survives storage failure within the session', () => {
    localStorage.setItem('kc:progress', '{bad');
    addRound('huruf');
    expect(getRounds('huruf')).toBe(1);
  });
});
