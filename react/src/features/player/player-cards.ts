import type { Item } from '../item/items';

export const playerCounts = [
	2,
	3,
	4,
	5,
] as const;
type PlayerCount = (typeof playerCounts)[number];

export function assignPlayers(
	playerCount: PlayerCount,
	startingTileId: number,
): ActivePlayer[] {
	// Shuffle or pick random unique roles from ROLE_TEMPLATES
	const shuffledRoles = [
		...ROLE_TEMPLATES,
	].sort(() => 0.5 - Math.random());
	const selectedRoles = shuffledRoles.slice(0, playerCount);

	// Map them into active players with runtime state
	return selectedRoles.map((role, index) => ({
		id: `player-${index + 1}`,
		role: role,
		currentWaterLevel: role.maxWater, // Starts at max water
		currentTileId: startingTileId, // Everyone starts on the crash site/helipad
		items: [],
	}));
}

const playerTitles = [
	'Excavator',
	'Hiker',
	'Traveler',
	'Cartographer',
	'Weather forecaster',
	'Water dispenser',
] as const;
type PlayerTitle = (typeof playerTitles)[number];

interface RoleTemplate {
	title: PlayerTitle;
	ability: string;
	maxWater: 3 | 4 | 5;
	color: '#ef4444' | '#000000' | '#10b981' | '#f59e0b' | '#FFFFFF' | '#06b6d4';
}

export interface ActivePlayer {
	id: string; // e.g., 'player-1'
	role: RoleTemplate;
	currentWaterLevel: number;
	currentTileId: number; // The ID of the tile they are standing on
	items: Item[];
}

const ROLE_TEMPLATES: RoleTemplate[] = [
	{
		title: 'Excavator',
		ability: 'Digs two sand points at once',
		maxWater: 3,
		color: '#ef4444',
	},
	{
		title: 'Hiker',
		ability: 'Never stuck in sand; can carry one other player while moving',
		maxWater: 3,
		color: '#000000',
	},
	{
		title: 'Traveler',
		ability: 'Can move and do things diagonally',
		maxWater: 4,
		color: '#10b981',
	},
	{
		title: 'Cartographer',
		ability:
			'Can move other players up to three spaces away from their current tile according to their movement abilities',
		maxWater: 4,
		color: '#f59e0b',
	},
	{
		title: 'Weather forecaster',
		ability:
			'Can spend an action looking at the next hurricane cards depending on the hurricane level and optionally defer the card to the end of the deck, and can spend an action to draw one less storm card',
		maxWater: 4,
		color: '#FFFFFF',
	},
	{
		title: 'Water dispenser',
		ability:
			'Can share water to players on neighboring tiles, and can spend an action to increase their water level by one when standing on revealed Water tiles',
		maxWater: 5,
		color: '#06b6d4',
	},
];
