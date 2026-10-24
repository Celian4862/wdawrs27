import { shuffle } from '../shuffle';
import { partNames, partOrientations } from './data';
import type { HintTile, OtherRevTile, RevSandTile, Tile } from './types';

export function shuffleBoard() {
	const board = Array<Tile>(25);

	// HURRICANE TILE
	board[12] = {
		type: 'hurricane',
		id: 12,
	};

	// STARTING TILE
	board[19] = {
		type: 'board',
		id: 19,
		sandPoints: 0,
		revealed: false,
		unrevealedType: 'Start',
		revealedType: 'Item',
		parts: new Set(),
	};

	// GREENTH TILES
	const greenthTiles = shuffle(['Water', 'Water', 'Fake'] as const);
	[3, 5, 21].forEach((greenthIndex, index) => {
		board[greenthIndex] = {
			type: 'board',
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
		{ revealedType: 'Exit' } as OtherRevTile,
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
	Array.from(
		{
			length: 25,
		},
		(_, index) => index,
	)
		.filter((position) => ![3, 5, 12, 19, 21].includes(position))
		.forEach((position, index) => {
			board[position] =
				sandTiles[index].revealedType === 'Hint'
					? {
							type: 'board',
							id: position,
							sandPoints: [2, 6, 8, 10, 14, 16, 18, 22].includes(position)
								? 1
								: 0,
							revealed: false,
							unrevealedType: 'Sand',
							revealedType: sandTiles[index].revealedType,
							partHint: sandTiles[index].partHint,
							partOrientation: sandTiles[index].partOrientation,
							parts: new Set(),
						}
					: {
							type: 'board',
							id: position,
							sandPoints: [2, 6, 8, 10, 14, 16, 18, 22].includes(position)
								? 1
								: 0,
							revealed: false,
							unrevealedType: 'Sand',
							revealedType: sandTiles[index].revealedType,
							parts: new Set(),
						};
		});

	return board;
}
