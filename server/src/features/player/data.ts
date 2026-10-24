import type { PlayerRole } from './types';

export const playerRoles: PlayerRole[] = [
	{
		title: 'Digger',
		ability: 'Digs two sand points at once.',
		maxWater: 3,
	},
	{
		title: 'Hiker',
		ability: 'Never stuck in sand; can carry one other player while moving.',
		maxWater: 3,
	},
	{
		title: 'Traveler',
		ability: 'Can move, do actions, and use Sand Removers diagonally.',
		maxWater: 4,
	},
	{
		title: 'Cartographer',
		ability:
			'Can use an action to move other players up to three spaces away from their current tile. Hiker and Traveler can still use their movement abilities when moved by Cartographer.',
		maxWater: 4,
	},
	{
		title: 'Weather Forecaster',
		ability:
			'Can use an action to look at the next set of hurricane cards and optionally defer one card to the end of the deck. Can use an action to draw one less storm card.',
		maxWater: 4,
	},
	{
		title: 'Water Dispenser',
		ability:
			'Can share water to players on neighboring tiles, and can use an action to increase their water level by one when standing on revealed Water tiles.',
		maxWater: 5,
	},
];
