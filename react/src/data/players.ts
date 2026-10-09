import type { ItemType } from './items';
import { shuffle } from './shuffle';

export function assignPlayers(playerCount: number) {
	const activePlayers = shuffle(roleTemplates)
		.slice(0, playerCount)
		.map<ActivePlayer>((role, index) => ({
			id: index,
			role: role,
			currentWaterLevel: role.maxWater,
			currentTileId: 19,
			items: [],
			isTurn: false,
		}));

	const minWater = activePlayers.reduce((min, current) =>
		current.role.maxWater < min.role.maxWater ? current : min,
	);

	return activePlayers.map((player) =>
		player === minWater ? { ...player, isTurn: true } : player,
	);
}

export function findCurrentPlayer(players: ActivePlayer[]) {
	return players.find((player) => player.isTurn);
}

export interface ActivePlayer {
	id: number;
	role: (typeof roleTemplates)[number];
	currentWaterLevel: number;
	currentTileId: number;
	items: ItemType[];
	isTurn: boolean;
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
		color: '#FFFFFF',
	},
	{
		title: 'Water Dispenser',
		ability:
			'Can share water to players on neighboring tiles, and can use an action to increase their water level by one when standing on revealed Water tiles.',
		maxWater: 5,
		color: '#06b6d4',
	},
];
