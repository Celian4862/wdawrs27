import type { ActivePlayer } from '../player/types';

export interface GameState {
	players: readonly ActivePlayer[];
}
