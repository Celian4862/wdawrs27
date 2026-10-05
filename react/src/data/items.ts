import { shuffle } from '@/data/shuffle';

const items = [
	...Array(3).fill('Sand Remover'),
	...Array(3).fill('Flying Tool'),
	...Array(2).fill('Thirst Shield'),
	...Array(2).fill('X-Ray Goggles'),
	'Add 2 Water',
	'Speed Boost',
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
