import { parts } from './parts';
import type { ActivePlayer } from './players';
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

export function findNeighboring(
	board: Tile[],
	currentPosition: number,
	playerTitle: string,
) {
	const [mainRow, mainCol] = toCoordinates(currentPosition);
	const isTraveler = playerTitle === 'Traveler';

	const neighboring = [
		toIndex(mainRow - 1, mainCol),
		toIndex(mainRow + 1, mainCol),
		toIndex(mainRow, mainCol - 1),
		toIndex(mainRow, mainCol + 1),
	];
	if (isTraveler) {
		neighboring.push(
			toIndex(mainRow - 1, mainCol - 1),
			toIndex(mainRow - 1, mainCol + 1),
			toIndex(mainRow + 1, mainCol - 1),
			toIndex(mainRow + 1, mainCol + 1),
		);
	}
	const filtered = neighboring.filter((tilePosition) => tilePosition >= 0);
	return filtered.filter((tilePosition) => board[tilePosition].info);
}

export function findMoveable(
	board: Tile[],
	neighboringTilePositions: number[],
	hikerTilePosition: number,
	currentPlayer: ActivePlayer
) {
	return neighboringTilePositions.filter((neighboringTilePosition) => {
		const neighboringTile = board[neighboringTilePosition].info;
		if (!neighboringTile) {
			throw new Error('Neighboring Tile is not valid');
		}
		console.log(`Hiker's Position: ${hikerTilePosition}\nNeighboring Position: ${neighboringTilePosition}`)
		return (
			neighboringTile.sandPoints < 2 || neighboringTilePosition === hikerTilePosition || currentPlayer.role.title === 'Hiker'
		);
	});
}

export function findSandPoints(
	board: Tile[],
	currentPosition: number,
	neighboringTilePositions: number[],
) {
	const currentAndNeighboringPositions = [
		...neighboringTilePositions,
		currentPosition,
	];
	return currentAndNeighboringPositions.filter((position) => {
		const tileInfo = board[position].info;
		if (!tileInfo) {
			throw new Error('Tile is not valid');
		}
		return tileInfo.sandPoints > 0;
	});
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
