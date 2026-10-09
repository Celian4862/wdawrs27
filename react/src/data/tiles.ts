import { parts } from './parts';
import { shuffle } from './shuffle';

export interface Tile {
	id: number;
	info?: {
		sandPoints: number;
		revealed: boolean;
		unrevealedType: string;
		revealedType: string;
		partHint?: string;
		partOrientation?: string;
		unrevealedTileColor: string;
		revealedTileColor: string;
		orientationEmoji?: string;
		partCount: number;
	};
}

export function toIndex(row: number, col: number) {
	if (row < 0 || row > 4 || col < 0 || col > 4) {
		return -1;
	}
	return row * 5 + col;
}

export function toCoordinates(index: number) {
	return [Math.floor(index / 5), index % 5];
}

export function sumSandPoints(board: Tile[]) {
	return board.reduce((sum, tile) => sum + (tile.info?.sandPoints ?? 0), 0);
}

// export function isInvalidTile(action: string, playerPosition: number, tilePosition: number, isTraveler: boolean = false, isHiker: boolean = false) {
// 	switch (action) {
// 		case 'Move':
// 			findNeighboring()
// 	}
// }

export function findNeighboring(board: Tile[], mainTilePosition: number) {
	const [mainRow, mainCol] = toCoordinates(mainTilePosition);

	return {
		up: board[toIndex(mainRow - 1, mainCol)],
		down: board[toIndex(mainRow + 1, mainCol)],
		left: board[toIndex(mainRow, mainCol - 1)],
		right: board[toIndex(mainRow, mainCol + 1)],
		up_left: board[toIndex(mainRow - 1, mainCol - 1)],
		up_right: board[toIndex(mainRow - 1, mainCol + 1)],
		down_left: board[toIndex(mainRow + 1, mainCol - 1)],
		down_right: board[toIndex(mainRow + 1, mainCol + 1)],
	};
}

export function shuffleBoard() {
	const board: Tile[] = Array(25);

	// HURRICANE TILE
	board[12] = {
		id: 12,
	};

	// STARTING TILE
	board[19] = {
		id: 19,
		info: {
			sandPoints: 0,
			revealed: false,
			unrevealedType: 'Start',
			revealedType: 'Item',
			unrevealedTileColor: 'bg-red-700',
			revealedTileColor: 'bg-slate-700',
			partCount: 0,
		},
	};

	// GREENTH TILES
	const greenthTiles = shuffle(['Water', 'Water', 'Fake']);
	[3, 5, 21].forEach((greenthIndex, index) => {
		board[greenthIndex] = {
			id: greenthIndex,
			info: {
				sandPoints: 0,
				revealed: false,
				unrevealedType: 'Greenth',
				revealedType: greenthTiles[index],
				unrevealedTileColor: 'bg-lime-600',
				revealedTileColor:
					greenthTiles[index] === 'Water' ? 'bg-blue-700' : 'bg-amber-700',
				partCount: 0,
			},
		};
	});

	// REMAINING TILES
	const partOrientations = parts.flatMap((part) => [
		{ ...part, orientation: 'Row' },
		{ ...part, orientation: 'Col' },
	]);
	const sandTiles = shuffle<{
		revealedType: string;
		partHint?: string;
		revealedTileColor: string;
		partOrientation?: string;
	}>([
		{ revealedType: 'Exit', revealedTileColor: 'bg-white/80' },
		...Array(3).fill({ revealedType: 'Shade', revealedTileColor: 'bg-black' }),
		...Array(8).fill({
			revealedType: 'Item',
			revealedTileColor: 'bg-slate-700',
		}),
		...partOrientations.map((partOrientation) => ({
			revealedType: 'Hint',
			partHint: partOrientation.part,
			revealedTileColor: partOrientation.color,
			partOrientation: partOrientation.orientation,
		})),
	]);
	Array.from(
		{
			length: 25,
		},
		(_, index) => index,
	)
		.filter((position) => ![3, 5, 12, 19, 21].includes(position))
		.forEach((position, index) => {
			board[position] = {
				id: position,
				info: {
					sandPoints: [2, 6, 8, 10, 14, 16, 18, 22].includes(position) ? 1 : 0,
					revealed: false,
					unrevealedType: 'Sand',
					revealedType: sandTiles[index].revealedType,
					partHint: sandTiles[index].partHint,
					partOrientation: sandTiles[index].partOrientation,
					unrevealedTileColor: 'bg-yellow-300/80',
					revealedTileColor: sandTiles[index].revealedTileColor,
					orientationEmoji:
						sandTiles[index].partOrientation === 'Row'
							? '↔️'
							: sandTiles[index].partOrientation === 'Col'
								? '↕️'
								: '',
					partCount: 0,
				},
			};
		});

	return board;
}
