import type { Board, PartNames } from "./features/board/types";
import type {
	HurricaneCard,
	HurricaneDeck,
	HurricaneMeter,
} from "./features/hurricane/types";
import type { ItemDeck, ItemKey } from "./features/item/types";
import type { PlayerState } from "./features/player/types";

export type GameStatus = "waiting" | "started" | "finished";
export type GameAction =
	| "move"
	| "removeSand"
	| "collectPart"
	| "revealTile"
	| ItemKey;

export interface GameState {
	readonly board: Board;
	readonly players: PlayerState;
	readonly hurricaneDeck: HurricaneDeck;
	readonly drawnHurricaneCard: HurricaneCard | null;
	readonly hurricaneMeter: HurricaneMeter;
	readonly itemDeck: ItemDeck;
	readonly drawnItemCard: ItemKey | "";
	readonly partsCollected: PartNames[];
}
