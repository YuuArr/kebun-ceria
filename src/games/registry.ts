import type { AreaId, GameDef, GameId } from './types';

export const GAMES: GameDef[] = [];

export const gamesIn = (area: AreaId) => GAMES.filter((g) => g.area === area);
export const gameById = (id: string): GameDef | undefined => GAMES.find((g) => g.id === (id as GameId));
