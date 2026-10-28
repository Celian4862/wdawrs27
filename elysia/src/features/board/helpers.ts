import { shuffle } from '../shared/helpers';
import {
	greenthTileIds,
	hurricaneId,
	partNames,
	partOrientations,
	sandPointIds,
	sandTileIds,
	startTileId,
} from './data';
import type { Board, HintTile, OtherRevTile, RevSandTile, Tile } from './types';

export function shuffleBoard(): Board {
	const board = Array<Tile>(25);

	// HURRICANE TILE
	board[hurricaneId] = {
		id: hurricaneId,
	};

	// STARTING TILE
	board[startTileId] = {
		id: startTileId,
		sandPoints: 0,
		revealed: false,
		unrevealedType: 'Start',
		revealedType: 'Item',
		parts: new Set(),
	};

	// GREENTH TILES
	const greenthTiles = shuffle(['Water', 'Water', 'Fake'] as const);
	greenthTileIds.forEach((greenthIndex, index) => {
		board[greenthIndex] = {
			id: greenthIndex,
			sandPoints: 0,
			revealed: false,
			unrevealedType: 'Greenth',
			revealedType: greenthTiles[index],
			parts: new Set(),
		};
	});

	// ASSEMBLING SAND TILES
	const sandTiles = shuffle<RevSandTile>([
		{ revealedType: 'Exit' },
		...Array<OtherRevTile>(3).fill({ revealedType: 'Shade' }),
		...Array<OtherRevTile>(8).fill({
			revealedType: 'Item',
		}),
		...partOrientations.flatMap((partOrientation) => {
			return partNames.map<HintTile>((partName) => ({
				revealedType: 'Hint',
				partHint: partName,
				partOrientation: partOrientation,
			}));
		}),
	]);
	// DISTRIBUTING SAND TILES
	sandTileIds.forEach((position, index) => {
		board[position] =
			sandTiles[index].revealedType === 'Hint'
				? {
						id: position,
						sandPoints: sandPointIds.has(position) ? 1 : 0,
						revealed: false,
						unrevealedType: 'Sand',
						revealedType: sandTiles[index].revealedType,
						partHint: sandTiles[index].partHint,
						partOrientation: sandTiles[index].partOrientation,
						parts: new Set(),
					}
				: {
						id: position,
						sandPoints: sandPointIds.has(position) ? 1 : 0,
						revealed: false,
						unrevealedType: 'Sand',
						revealedType: sandTiles[index].revealedType,
						parts: new Set(),
					};
	});
	return board;
}
