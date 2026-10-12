import type { ItemType } from './items';
import { shuffle } from './shuffle';

export function assignPlayers(playerCount: number) {
	const roles = shuffle(roleTemplates).slice(0, playerCount);
	const minWaterIdx = roles.reduce(
		(minIdx, current, idx, arr) =>
			current.maxWater < arr[minIdx].maxWater ? idx : minIdx,
		0,
	);

	return [
		...roles.slice(minWaterIdx),
		...roles.slice(0, minWaterIdx),
	].map<ActivePlayer>((role, index) => ({
		id: index,
		role: role,
		currentWaterLevel: role.maxWater,
		currentTileId: 19,
		items: [],
	}));
}

export function cyclePlayers(players: ActivePlayer[]) {
	const newPlayers = [...players];
	const prevPlayer = newPlayers.shift();
	if (!prevPlayer) {
		throw new Error('Array is empty');
	}
	newPlayers.push(prevPlayer);
	return newPlayers;
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
		color: '#0b7f59',
	},
	{
		title: 'Cartographer',
		ability:
			'Can use an action to move other players up to three spaces away from their current tile. Hiker and Traveler can still use their movement abilities when moved by Cartographer.',
		maxWater: 4,
		color: '#f59e0b',
	},
	{
		title: 'Weather Forecaster',
		ability:
			'Can use an action to look at the next set of hurricane cards and optionally defer one card to the end of the deck. Can use an action to draw one less storm card.',
		maxWater: 4,
		color: '#b1b1b1',
	},
	{
		title: 'Water Dispenser',
		ability:
			'Can share water to players on neighboring tiles, and can use an action to increase their water level by one when standing on revealed Water tiles.',
		maxWater: 5,
		color: '#06b6d4',
	},
];
