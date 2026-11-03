import type { HurricaneMeter } from "../hurricane/types";
import type { PlayerState } from "../player/types";

export type GameStatus = "waiting" | "started" | "finished";

export interface GameState {
	readonly players: PlayerState;

	readonly hurricaneMeter: HurricaneMeter;
}
