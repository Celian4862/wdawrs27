import type { ItemKey } from "../item/types";
import type { playerRoles } from "./data";

export type RoleKey = keyof typeof playerRoles;
export type PlayerTitle = (typeof playerRoles)[RoleKey]["title"];
export type PlayerInventory = Readonly<Record<ItemKey, number>>;

export interface ActivePlayer {
	readonly roleKey: RoleKey;
	readonly currentWater: number;
	readonly tileId: number;
	readonly inventory: PlayerInventory;
}
export type PlayerState = readonly ActivePlayer[];
