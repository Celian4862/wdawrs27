import type { Board, PartNames } from "../board/types";
import type {
	HurricaneCard,
	HurricaneDeck,
	HurricaneMeter,
} from "../hurricane/types";
import type { ItemDeck, ItemKey } from "../item/types";
import type { PlayerState } from "../player/types";

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
