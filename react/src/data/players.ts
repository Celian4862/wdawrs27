import type { ItemType } from './items';
import { shuffle } from './shuffle';

export function assignPlayers(playerCount: number) {
	return shuffle(roleTemplates)
		.slice(0, playerCount)
		.map<ActivePlayer>((role, index) => ({
			id: index,
			role: role,
			currentWaterLevel: role.maxWater,
			currentTileId: 19,
			items: [],
		}));
}

export interface ActivePlayer {
	id: number;
	role: (typeof roleTemplates)[number];
	currentWaterLevel: number;
	currentTileId: number;
	items: ItemType[];
}

const roleTemplates = [
	{
		title: 'Digger',
		ability: 'Digs two sand points at once.',
		maxWater: 3,
		color: '#ef4444',
	},
	{
		title: 'Hiker',
		ability: 'Never stuck in sand; can carry one other player while moving.',
		maxWater: 3,
		color: '#000000',
	},
	{
		title: 'Traveler',
		ability: 'Can move, do actions, and use Sand Removers diagonally.',
		maxWater: 4,
		color: '#10b981',
	},
	{
		title: 'Cartographer',
		ability:
			'Can move other players up to three spaces away from their current tile. Hiker and Traveler can still use their movement abilities when moved by Cartographer.',
		maxWater: 4,
		color: '#f59e0b',
	},
	{
		title: 'Weather Forecaster',
		ability:
			'Can spend an action to look at the next set of hurricane cards and optionally defer one card to the end of the deck. Can spend an action to draw one less storm card.',
		maxWater: 4,
		color: '#FFFFFF',
	},
	{
		title: 'Water Dispenser',
		ability:
			'Can share water to players on neighboring tiles, and can spend an action to increase their water level by one when standing on revealed Water tiles.',
		maxWater: 5,
		color: '#06b6d4',
	},
];
