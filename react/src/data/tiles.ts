import { shuffle } from './shuffle';

export interface Tile {
	id: number;
	info?: {
		sandPoints: number;
		revealed: boolean;
		unrevealedType: string;
		revealedType: string;
		hintVariant?: string;
		hintOrientation?: string;
		unrevealedTileEmoji: string;
		revealedTileEmoji: string;
	};
}

export function toIndex(row: number, col: number) {
	return row * 5 + col;
}

export function toCoordinates(index: number) {
	return [Math.floor(index / 5), index % 5];
}

export function sumSandPoints(board: Tile[]) {
	return board.reduce((sum, tile) => sum + (tile.info?.sandPoints ?? 0), 0);
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
			unrevealedTileEmoji: '🚩',
			revealedTileEmoji: '⚙️',
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
				unrevealedTileEmoji: '🌵',
				revealedTileEmoji: greenthTiles[index] === 'Water' ? '💧' : '🥀',
			},
		};
	});

	// REMAINING TILES
	const hintVariants = [
		'Pointer Row',
		'Pointer Col',
		'Motor Row',
		'Motor Col',
		'Core Row',
		'Core Col',
		'Fan Row',
		'Fan Col',
	];
	const sandTiles = shuffle<{
		revealedType: string;
		hintVariant?: string;
	}>([
		{ revealedType: 'Exit' },
		...Array(3).fill({ revealedType: 'Shade' }),
		...Array(8).fill({ revealedType: 'Item' }),
		...hintVariants.map((hintVariant) => ({
			revealedType: 'Hint',
			hintVariant,
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
					hintVariant: sandTiles[index].hintVariant,
					unrevealedTileEmoji: '🏜️',
					revealedTileEmoji:
						sandTiles[index].revealedType !== 'Hint'
							? (
									{ Exit: '🏁', Shade: '🕳️', Item: '⚙️' } as Record<
										string,
										string
									>
								)[sandTiles[index].revealedType]
							: sandTiles[index].hintVariant
								? (
										{
											'Pointer Row': '🧭',
											'Pointer Col': '🧭',
											'Motor Row': '⚡',
											'Motor Col': '⚡',
											'Core Row': '💎',
											'Core Col': '💎',
											'Fan Row': '🪭',
											'Fan Col': '🪭',
										} as Record<string, string>
									)[sandTiles[index].hintVariant]
								: '',
					hintOrientation: sandTiles[index].hintVariant
						? {
								'Pointer Row': '↔️',
								'Pointer Col': '↕️',
								'Motor Row': '↔️',
								'Motor Col': '↕️',
								'Core Row': '↔️',
								'Core Col': '↕️',
								'Fan Row': '↔️',
								'Fan Col': '↕️',
							}[sandTiles[index].hintVariant]
						: undefined,
				},
			};
		});

	return board;
}
