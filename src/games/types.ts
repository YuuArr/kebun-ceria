import type { AudioService } from '../core/audio';
import type { Rng } from '../core/rng';
import type { Settings } from '../core/settings';

export type GameId = 'hitung' | 'kuas' | 'huruf';
export type AreaId = 'angka' | 'warna' | 'huruf';

export interface GameContext {
  root: HTMLElement;
  audio: AudioService;
  settings: Settings;
  rng: Rng;
  /** Call once when the round is complete: celebrates, grows the garden, returns to the area. */
  finishRound(): void;
}

export interface GameDef {
  id: GameId;
  area: AreaId;
  /** Short name for parents (Pojok Orang Tua) and aria-label. */
  name: string;
  /** What it trains and which method, shown to parents. */
  parentNote: string;
  icon: () => SVGElement;
  /** Starts the game in ctx.root; returns cleanup. */
  start(ctx: GameContext): () => void;
}
