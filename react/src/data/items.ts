import { shuffle } from '@/data/shuffle';

export interface ItemType {
	id: number;
	type: string;
	description: string;
}

export const items: ItemType[] = [
	...Array.from({ length: 3 }, (_, index) => ({
		id: index,
		type: 'Sand Remover',
		description:
			'Remove all sand points from your tile or a neighboring tile. Use at any time.',
	})),
	...Array.from({ length: 3 }, (_, index) => ({
		id: index,
		type: 'Flying Tool',
		description: 'Fly from one tile to any unobstructed tile. Use at any time.',
	})),
	...Array.from({ length: 2 }, (_, index) => ({
		id: index,
		type: 'Thirst Shield',
		description:
			'All players on your tile will be protected from Thirst cards until your next turn. Use at any time.',
	})),
	...Array.from({ length: 2 }, (_, index) => ({
		id: index,
		type: 'X-Ray Goggles',
		description:
			'See the revealed type of any unrevealed tile. Use at any time.',
	})),
	{
		id: 0,
		type: 'Add 2 Water',
		description:
			'All players on your tile gain +2 water points. Use at any time.',
	},
	{
		id: 0,
		type: 'Speed Boost',
		description: 'You can do 2 more actions. Use on your turn.',
	},
];

export function shuffleItemDeck() {
	return shuffle(items);
}

export const maxItemCounts: Record<string, number> = {
	'Sand Remover': 3,
	'Flying Tool': 3,
	'Thirst Shield': 2,
	'X-Ray Goggles': 2,
	'Add 2 Water': 1,
	'Speed Boost': 1,
};
