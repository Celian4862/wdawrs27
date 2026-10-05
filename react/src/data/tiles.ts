import { shuffle } from './shuffle';
export const tiles: {
	id: number;
	info?: {
		sandMarks: number;
		revealed: boolean;
		unrevealedType: string;
		revealedType: string;
		hintVariant?: string;
	};
}[] = Array(25);

// HURRICANE TILE
tiles[12] = {
	id: 12,
};

// STARTING TILE
tiles[19] = {
	id: 19,
	info: {
		sandMarks: 0,
		revealed: false,
		unrevealedType: 'Start',
		revealedType: 'Item',
	},
};

// GREENTH TILES
const greenthTiles = shuffle(['Water', 'Water', 'Fake']);
[3, 5, 21].forEach((greenthIndex, index) => {
	tiles[greenthIndex] = {
		id: greenthIndex,
		info: {
			sandMarks: 0,
			revealed: false,
			unrevealedType: 'Greenth',
			revealedType: greenthTiles[index],
		},
	};
});

// REMAINING TILES
const sandTiles = shuffle<{
	revealedType: string;
	hintVariant?: string;
}>([
	{ revealedType: 'Exit' },
	...Array(3).fill({ revealedType: 'Shade' }),
	...Array(8).fill({ revealedType: 'Item' }),
	...[
		'Pointer Row',
		'Pointer Col',
		'Motor Row',
		'Motor Col',
		'Core Row',
		'Core Col',
		'Fan Row',
		'Fan Col',
	].map((hintVariant) => ({ revealedType: 'Hint', hintVariant })),
]);
Array.from(
	{
		length: 25,
	},
	(_, index) => index,
)
	.filter((position) => ![3, 5, 12, 19, 21].includes(position))
	.forEach((position, index) => {
		tiles[position] = {
			id: position,
			info: {
				sandMarks: 0,
				revealed: false,
				unrevealedType: 'Sand',
				revealedType: sandTiles[index].revealedType,
				hintVariant: sandTiles[index].hintVariant,
			},
		};
	});
