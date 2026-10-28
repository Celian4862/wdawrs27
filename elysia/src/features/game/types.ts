import type { PlayerState } from '../player/types';

export interface GameState {
	readonly players: PlayerState;
}
