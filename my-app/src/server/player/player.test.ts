import { describe, expect, it } from "vitest";
import { playerRoles } from "./data";
import {
	addItems,
	adjustWater,
	assignPlayers,
	createPlayerInventory,
	getCurrentPlayer,
	getMaxWater,
	getRoleTitle,
	passTurn,
	shufflePlayers,
	transferItems,
} from "./helpers";

describe("player unit tests", () => {
	const playerCount = 3;
	const roles = shufflePlayers(playerCount);
	const players = assignPlayers(roles);
	const currentPlayer = getCurrentPlayer(players);

	it("gives a randomized array of players", () => {
		expect(roles).not.toEqual(shufflePlayers(playerCount));
	});

	it("correctly initializes players", () => {
		expect(players).toHaveLength(playerCount);

		const firstPlayerWater = currentPlayer.currentWater;

		players.forEach((player) => {
			// Check water matches role's maxWater exactly
			expect(player.currentWater).toBe(playerRoles[player.roleKey].maxWater);

			// Check static starting properties
			expect(player.tileId).toBe(19);

			// Check first player's water is min

			expect(firstPlayerWater).toBeLessThanOrEqual(player.currentWater);

			// Check items Record starts with 0 counts
			for (const count of Object.values(player.inventory)) {
				expect(count).toBe(0);
			}
		});
	});

	describe("passing turns", () => {
		it("rotates the player order correctly", () => {
			const originalFirst = currentPlayer;
			const originalSecond = players[1];

			const rotatedPlayers = passTurn(players);

			expect(rotatedPlayers).toHaveLength(players.length);

			expect(rotatedPlayers[rotatedPlayers.length - 1]).toEqual(originalFirst);

			expect(rotatedPlayers[0]).toEqual(originalSecond);
		});

		it("throws an error when rotating an empty array", () => {
			expect(() => passTurn([])).toThrow(Error);
		});
	});

	describe("getters", () => {
		it("returns the correct role title", () => {
			expect(getRoleTitle(currentPlayer.roleKey)).toBe(
				playerRoles[currentPlayer.roleKey].title,
			);
		});

		it("returns the correct max water", () => {
			expect(getMaxWater(currentPlayer.roleKey)).toBe(
				playerRoles[currentPlayer.roleKey].maxWater,
			);
		});
	});

	describe("adjusting water", () => {
		it("adjusts water correctly", () => {
			const targetIndices = [0, 2];
			let delta = -2;
			let tempPlayers = adjustWater(
				players,
				new Set(targetIndices.map((i) => players[i].roleKey)),
				delta,
			);
			for (let i = 0; i < tempPlayers.length; i++) {
				const maxWater = getMaxWater(tempPlayers[i].roleKey);
				expect(tempPlayers[i].currentWater).toBe(
					targetIndices.includes(i) ? maxWater + delta : maxWater,
				);
			}

			delta = 7;
			tempPlayers = adjustWater(
				players,
				new Set(targetIndices.map((i) => players[i].roleKey)),
				delta,
			);

			for (let i = 0; i < tempPlayers.length; i++) {
				const maxWater = getMaxWater(tempPlayers[i].roleKey);
				expect(tempPlayers[i].currentWater).toBe(maxWater);
			}
		});
	});

	describe("transferring items", () => {
		let tempPlayers = addItems(
			players,
			currentPlayer.roleKey,
			createPlayerInventory({ flyingTool: 3 }),
		);
		it("accepts an item transfer", () => {
			tempPlayers = transferItems(
				tempPlayers,
				tempPlayers[0].roleKey,
				tempPlayers[1].roleKey,
				createPlayerInventory({ flyingTool: 1 }),
			);
			expect(tempPlayers[0].inventory.flyingTool).toBe(2);
			expect(tempPlayers[1].inventory.flyingTool).toBe(1);
		});

		it("rejects an item transfer", () => {
			// Initialization
			// Case: lacking items
			let unchangedTemp = transferItems(
				tempPlayers,
				tempPlayers[0].roleKey,
				tempPlayers[1].roleKey,
				createPlayerInventory({ sandRemover: 1 }),
			);
			expect(unchangedTemp).toBe(tempPlayers);

			// Case: same player
			unchangedTemp = transferItems(
				tempPlayers,
				tempPlayers[0].roleKey,
				tempPlayers[0].roleKey,
				createPlayerInventory({ sandRemover: 1 }),
			);
			expect(unchangedTemp).toBe(tempPlayers);

			// Case: no items to transfer
			unchangedTemp = transferItems(
				tempPlayers,
				tempPlayers[0].roleKey,
				tempPlayers[1].roleKey,
				createPlayerInventory({}),
			);
			expect(unchangedTemp).toBe(tempPlayers);
		});
	});
});
