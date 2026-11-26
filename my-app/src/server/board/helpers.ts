import { produce } from "immer";
import type { ActivePlayer } from "../player/types";
import { shuffle } from "../shared/helpers";
import {
	greenthTileIds,
	hurricaneId,
	partNames,
	partOrientations,
	sandPointIds,
	sandTileIds,
	startTileId,
} from "./data";
import type { Board, HintTile, OtherRevTile, RevSandTile, Tile } from "./types";

export function revealTileHelper(board: Board, currentPlayer: ActivePlayer) {
	const currentTileIndex = getCurrentTileIndex(board, currentPlayer);
	return produce(board, (draft) => {
		if (draft[currentTileIndex].id === hurricaneId) {
			return;
		}
		draft[currentTileIndex].revealed = true;
	});
}

export function findNeighboring(board: Board, player: ActivePlayer) {
	const [mainRow, mainCol] = toCoordinates(getCurrentTileIndex(board, player));
	const isTraveler = player.roleKey === "traveler";

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
	return neighboring.filter(
		(tilePosition) =>
			tilePosition >= 0 && board[tilePosition].id !== hurricaneId,
	);
}

export function getCurrentTileIndex(board: Board, currentPlayer: ActivePlayer) {
	return board.findIndex((tile) => tile.id === currentPlayer.tileId);
}

export function findSandPoints(
	board: Board,
	currentPosition: number,
	neighboringTilePositions: number[],
) {
	const currentAndNeighboringPositions = [
		...neighboringTilePositions,
		currentPosition,
	];
	return currentAndNeighboringPositions.filter((position) => {
		if (board[position].id === hurricaneId) {
			throw new Error("Tile is not valid");
		}
		return board[position].sandPoints > 0;
	});
}

export function sumSandPoints(board: Board) {
	return board.reduce(
		(sum, tile) => sum + (tile.id === hurricaneId ? 0 : tile.sandPoints),
		0,
	);
}

export function toCoordinates(index: number) {
	return [Math.floor(index / 5), index % 5];
}

export function toIndex(row: number, col: number) {
	if (row < 0 || row > 4 || col < 0 || col > 4) {
		return -1;
	}
	return row * 5 + col;
}

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
		unrevealedType: "Start",
		revealedType: "Item",
		parts: [],
	};

	// GREENTH TILES
	const greenthTiles = shuffle(["Water", "Water", "Fake"] as const);
	greenthTileIds.forEach((greenthIndex, index) => {
		board[greenthIndex] = {
			id: greenthIndex,
			sandPoints: 0,
			revealed: false,
			unrevealedType: "Greenth",
			revealedType: greenthTiles[index],
			parts: [],
		};
	});

	// ASSEMBLING SAND TILES
	const sandTiles = shuffle<RevSandTile>([
		{ revealedType: "Exit" },
		...Array<OtherRevTile>(3).fill({ revealedType: "Shade" }),
		...Array<OtherRevTile>(8).fill({
			revealedType: "Item",
		}),
		...partOrientations.flatMap((partOrientation) => {
			return partNames.map<HintTile>((partName) => ({
				revealedType: partName,
				partOrientation: partOrientation,
			}));
		}),
	]);
	// DISTRIBUTING SAND TILES
	sandTileIds.forEach((position, index) => {
		board[position] =
			sandTiles[index].revealedType === "Core" ||
			sandTiles[index].revealedType === "Fan" ||
			sandTiles[index].revealedType === "Motor" ||
			sandTiles[index].revealedType === "Pointer"
				? {
						id: position,
						sandPoints: sandPointIds.has(position) ? 1 : 0,
						revealed: false,
						unrevealedType: "Sand",
						revealedType: sandTiles[index].revealedType,
						partOrientation: sandTiles[index].partOrientation,
						parts: [],
					}
				: {
						id: position,
						sandPoints: sandPointIds.has(position) ? 1 : 0,
						revealed: false,
						unrevealedType: "Sand",
						revealedType: sandTiles[index].revealedType,
						parts: [],
					};
	});
	return board;
}
