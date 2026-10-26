import type { ItemCardType } from '@/item/types';
import type { playerRoles } from './data';

export type PlayerRole = (typeof playerRoles)[number];

export interface ActivePlayer {
	id: number;
	role: PlayerRole;
	water: number;
	tileId: number;
	items: ItemCardType[];
}
