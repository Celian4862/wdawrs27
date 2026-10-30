import { describe, expect, it } from "vitest";
import {
	greenthTileIds,
	hurricaneId,
	partNames,
	partOrientations,
	sandPointIds,
	sandTileIds,
	startTileId,
} from "./data";
import { shuffleBoard } from "./helpers";

describe("shuffleBoard", () => {
	it("builds a complete 25-tile board with the fixed start and hurricane tiles", () => {
		const board = shuffleBoard();

		expect(board).toHaveLength(25);
		expect(board.every(Boolean)).toBe(true);
		expect(board[startTileId]).toMatchObject({
			id: startTileId,
			revealed: false,
			unrevealedType: "Start",
			revealedType: "Item",
			sandPoints: 0,
		});
		expect(board[hurricaneId]).toMatchObject({
			id: hurricaneId,
		});
	});

	it("fills the board with the correct number of green and sand tiles", () => {
		const board = shuffleBoard();
		const greenthTiles = board.filter(
			(tile) =>
				tile && "unrevealedType" in tile && tile.unrevealedType === "Greenth",
		);
		const sandTiles = board.filter(
			(tile) =>
				tile && "unrevealedType" in tile && tile.unrevealedType === "Sand",
		);

		expect(greenthTiles).toHaveLength(greenthTileIds.length);
		expect(sandTiles).toHaveLength(sandTileIds.length);
		expect(
			greenthTiles.every(
				(tile) => tile.revealedType === "Water" || tile.revealedType === "Fake",
			),
		).toBe(true);
		expect(
			greenthTiles.filter((tile) => tile.revealedType === "Water"),
		).toHaveLength(2);
		expect(
			greenthTiles.filter((tile) => tile.revealedType === "Fake"),
		).toHaveLength(1);

		for (const sandTileId of sandTileIds) {
			const tile = board[sandTileId];
			expect(tile).toMatchObject({
				id: sandTileId,
				unrevealedType: "Sand",
				revealed: false,
			});
			expect(tile.id).not.toBe(12);
			if (tile.id !== 12) {
				expect(tile.sandPoints).toBe(sandPointIds.has(sandTileId) ? 1 : 0);
			}
		}
	});

	it("uses every hint tile combination exactly once", () => {
		const board = shuffleBoard();
		const hintTiles = board.filter(
			(tile) => tile.id !== 12 && tile.revealedType === "Hint",
		);
		const combinations = new Set<string>();

		expect(hintTiles).toHaveLength(partNames.length * partOrientations.length);

		for (const tile of hintTiles) {
			expect(partNames).toContain(tile.partHint);
			expect(partOrientations).toContain(tile.partOrientation);
			combinations.add(`${tile.partHint}:${tile.partOrientation}`);
		}

		expect(combinations.size).toBe(partNames.length * partOrientations.length);
		for (const partName of partNames) {
			for (const orientation of partOrientations) {
				expect(combinations.has(`${partName}:${orientation}`)).toBe(true);
			}
		}
	});
});
