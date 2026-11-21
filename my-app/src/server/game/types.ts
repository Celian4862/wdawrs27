import type { Dispatch, SetStateAction } from "react";
import type { Board, PartNames } from "../board/types";
import type {
	HurricaneCard,
	HurricaneDeck,
	HurricaneMeter,
} from "../hurricane/types";
import type { ItemDeck, ItemKey } from "../item/types";
import type { PlayerState, RoleKey } from "../player/types";
import type { generalActions } from "./data";

export type UserInfo = Partial<
	Record<RoleKey, { isYou: boolean; playerName: string }>
>;

export type GameStatus = "waiting" | "started" | "finished";
export type GameAction = (typeof generalActions)[number] | ItemKey | null;
export type GameActionState = [
	GameAction,
	Dispatch<SetStateAction<GameAction>>,
];
export type GameInfo = GameState & {
	isAdmin: boolean;
};

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
