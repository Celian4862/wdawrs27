import type { ItemCardType } from '../ItemCardType';

export type PlayerRole = {
	ability: string;
} & (
	| {
			title: 'Digger' | 'Hiker';
			maxWater: 3;
	  }
	| {
			title: 'Traveler' | 'Cartographer' | 'Weather Forecaster';
			maxWater: 4;
	  }
	| {
			title: 'Water Dispenser';
			maxWater: 5;
	  }
);

export interface ActivePlayer {
	id: number;
	role: PlayerRole;
	water: number;
	tileId: number;
	items: ItemCardType[];
}
