import type { AudioService } from '../core/audio';
import type { Rng } from '../core/rng';
import type { Settings } from '../core/settings';

export type GameId = 'hitung' | 'kuas' | 'huruf' | 'monyet' | 'banding' | 'sungai' | 'kotakpos' | 'sortir' | 'rakit' | 'awal' | 'kartu' | 'cerita' | 'tulis' | 'tulisangka' | 'pola' | 'jumlah' | 'bayangan' | 'campur' | 'puzzle' | 'gambar' | 'besarkecil' | 'susun'
  | 'memori' | 'urutkan' | 'hilang' | 'kebiasaan' | 'sehat' | 'xilofon' | 'ritme' | 'induk' | 'makanan' | 'suara';
export type AreaId = 'angka' | 'warna' | 'huruf' | 'pikiran' | 'rumah' | 'musik' | 'hewan';

export interface GameContext {
  root: HTMLElement;
  audio: AudioService;
  settings: Settings;
  rng: Rng;
  /** 0–3: rises every few finished rounds of this game, never drops. */
  level: number;
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
  icon: () => Element;
  /** Starts the game in ctx.root; returns cleanup. */
  start(ctx: GameContext): () => void;
}
