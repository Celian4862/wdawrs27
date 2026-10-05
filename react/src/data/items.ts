import { shuffle } from '@/data/shuffle';

export const items = shuffle([
	...Array(3).fill('Sand Remover'),
	...Array(3).fill('Flying Tool'),
	...Array(2).fill('Thirst Shield'),
	...Array(2).fill('X-Ray Goggles'),
	'Add 2 Water',
	'Speed Boost',
]);
