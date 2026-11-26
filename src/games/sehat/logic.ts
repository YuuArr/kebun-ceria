import type { Rng } from '../../core/rng';
import type { AgeGroup } from '../../core/settings';

export const HEALTHY = ['apel', 'pisang', 'wortel', 'brokoli', 'jeruk', 'telur', 'nasi', 'ikan', 'susu', 'tomat', 'anggur', 'jagung'];
export const TREATS = ['permen', 'soda', 'donat', 'es-krim', 'wafer'];

export interface Plate {
  items: string[];
  /** How many healthy items to put on the plate. */
  need: number;
}

/** Three plates; drag the healthy food onto Cici's plate. Sweets bounce back softly. */
export function makePlateRound(age: AgeGroup, rng: Rng, level = 0): Plate[] {
  const need = age === '2-3' ? 2 : level >= 2 ? 3 : 2;
  const treats = age === '2-3' ? 1 : 2;
  return Array.from({ length: 3 }, () => ({
    need,
    items: rng.shuffle([...rng.shuffle(HEALTHY).slice(0, need), ...rng.shuffle(TREATS).slice(0, treats)]),
  }));
}
