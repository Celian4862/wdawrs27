import { useState } from 'react';
import type { ActivePlayer } from '../../player/player-cards';
import { tiles as TILES } from '../tiles';

const DIRECTION_OFFSETS = {
	Up: [
		-1,
		0,
	],
	Down: [
		1,
		0,
	],
	Left: [
		0,
		-1,
	],
	Right: [
		0,
		1,
	],
} as const;

export function useTiles() {
	const [tiles, setTiles] = useState(TILES);
	const totalSandMarks = tiles.reduce(
		(sum, tile) => sum + (tile?.sandMarks ?? 0),
		0,
	);

	const handleTileClick = (tileId: number) => {
		setTiles((prevTiles) =>
			prevTiles.map((tile) => {
				if (tile.id === tileId && tile.info) {
					return {
						...tile,
						info: {
							...tile.info,
							revealed: true,
						},
					};
				}
				return tile;
			}),
		);
	};

	const applyHurricaneMove = (
		card: string,
		_players: ActivePlayer[] = [],
		setPlayers?: React.Dispatch<React.SetStateAction<ActivePlayer[]>>,
	) => {
		const match = /^Move (\d+) (Up|Down|Left|Right)$/.exec(card);
		if (!match) return false;

		const movement = Number(match[1]);
		const direction = match[2] as keyof typeof DIRECTION_OFFSETS;
		const [rowOffset, colOffset] = DIRECTION_OFFSETS[direction];

		setTiles((prevTiles) => {
			const nextTiles = prevTiles.map((tile) => ({
				...tile,
				sandMarks: tile?.sandMarks ?? 0,
			}));
			let currentIndex = nextTiles.findIndex((tile) => tile && !tile.info);
			const swaps: Array<
				[
					number,
					number,
				]
			> = [];

			if (currentIndex === -1) return nextTiles;

			for (let step = 0; step < movement; step += 1) {
				const row = Math.floor(currentIndex / 5);
				const col = currentIndex % 5;
				const nextRow = row + rowOffset;
				const nextCol = col + colOffset;

				if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 5) {
					break;
				}

				const nextIndex = nextRow * 5 + nextCol;
				const hurricaneTile = nextTiles[currentIndex];
				const targetTile = nextTiles[nextIndex];

				if (!hurricaneTile || !targetTile) break;

				swaps.push([
					currentIndex,
					nextIndex,
				]);
				nextTiles[currentIndex] = {
					...targetTile,
					id: currentIndex,
					sandMarks: (targetTile.sandMarks ?? 0) + 1,
				};
				nextTiles[nextIndex] = {
					...hurricaneTile,
					id: nextIndex,
				};
				currentIndex = nextIndex;
			}

			if (setPlayers) {
				setPlayers((prevPlayers) => {
					return prevPlayers.map((player) => {
						let nextTileId = player.currentTileId;

						for (const [sourceIndex, targetIndex] of swaps) {
							if (nextTileId === sourceIndex) {
								nextTileId = targetIndex;
							} else if (nextTileId === targetIndex) {
								nextTileId = sourceIndex;
							}
						}

						return {
							...player,
							currentTileId: nextTileId,
						};
					});
				});
			}

			return nextTiles;
		});

		return true;
	};

	return {
		tiles,
		totalSandMarks,
		handleTileClick,
		applyHurricaneMove,
	};
}
