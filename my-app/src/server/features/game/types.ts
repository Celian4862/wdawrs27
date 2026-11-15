import type { Board, PartNames } from "../board/types";
import type { HurricaneDeck, HurricaneMeter } from "../hurricane/types";
import type { ItemDeck } from "../item/types";
import type { PlayerState } from "../player/types";

export type GameStatus = "waiting" | "started" | "finished";

export interface GameState {
	readonly board: Board;
	readonly players: PlayerState;
	readonly hurricaneDeck: HurricaneDeck;
	readonly hurricaneMeter: HurricaneMeter;
	readonly itemDeck: ItemDeck;
	readonly partsCollected: PartNames[];
}
