import type { ItemKey } from '../item/types';
import type { playerRoles } from './data';

export type RoleKey = keyof typeof playerRoles;
export type PlayerTitle = (typeof playerRoles)[RoleKey]['title'];
export type PlayerInventory = Record<ItemKey, number>;

export interface ActivePlayer {
	readonly roleKey: RoleKey;
	currentWater: number;
	tileId: number;
	inventory: PlayerInventory;
}
