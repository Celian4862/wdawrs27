import { shuffle } from '../shuffle';
import { hintVariants } from './hintVariants';
import { createTile, createTileDefinition, toIndex } from './tileHelpers';
import type { TileDefinition, TileType } from './tileTypes';

const hurricanePosition = toIndex(2, 2);
export const startingPosition = toIndex(3, 4);
const greenthPositions = [
	toIndex(0, 3),
	toIndex(1, 0),
	toIndex(4, 1),
];

const startingTile: TileDefinition = createTileDefinition('Start', 'Item');
const greenthTiles: TileDefinition[] = (
	[
		...Array(2).fill('Water'),
		'Fake',
	] as const
).map((revealedType) => createTileDefinition('Greenth', revealedType));
const sandTiles: TileDefinition[] = (() => {
	const normalSandTiles = (
		[
			'Exit',
			...Array(3).fill('Shade'),
			...Array(8).fill('Item'),
		] as const
	).map((revealedType) => createTileDefinition('Sand', revealedType));
	return [
		...normalSandTiles,
		...hintVariants.map((hintVariant) =>
			createTileDefinition('Sand', 'Hint', hintVariant),
		),
	];
})();

const board: TileType[] = Array(25).fill(null);

// The center always starts empty.
board[hurricanePosition] = createTile(hurricanePosition);

// The starting tile always starts at row 4, column 5.
board[startingPosition] = createTile(startingPosition, startingTile);

// Randomly assign the three greenth tiles to their three fixed positions.
const shuffledGreenthTiles = shuffle(greenthTiles);

greenthPositions.forEach((position, index) => {
	board[position] = createTile(position, shuffledGreenthTiles[index]);
});

// Find every remaining open board position.
const remainingPositions = Array.from(
	{
		length: 25,
	},
	(_, index) => index,
).filter(
	(position) =>
		position !== hurricanePosition &&
		position !== startingPosition &&
		!greenthPositions.includes(position),
);

// Randomly place the 20 sand tiles in those remaining positions.
const shuffledSandTiles = shuffle(sandTiles);

remainingPositions.forEach((position, index) => {
	board[position] = createTile(position, shuffledSandTiles[index]);
});

export const tiles = board;
