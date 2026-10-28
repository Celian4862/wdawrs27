import { describe, expect, it } from 'bun:test';
import { playerRoles } from '../features/player/data';
import {
	addItem,
	adjustWater,
	assignPlayers,
	createPlayerInventory,
	getMaxWater,
	getRoleTitle,
	passTurn,
	transferItems,
} from '../features/player/helpers';

describe('player unit tests', () => {
	const playerCount = 3;
	const players = assignPlayers(playerCount);
	it('correctly initializes players', () => {
		expect(players).toBeArrayOfSize(playerCount);

		const firstPlayerWater = players[0].currentWater;

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

	describe('passing turns', () => {
		it('rotates the player order correctly', () => {
			const originalFirst = players[0];
			const originalSecond = players[1];

			const rotatedPlayers = passTurn(players);

			expect(rotatedPlayers).toBeArrayOfSize(players.length);

			expect(rotatedPlayers[rotatedPlayers.length - 1]).toEqual(originalFirst);

			expect(rotatedPlayers[0]).toEqual(originalSecond);
		});

		it('throws an error when rotating an empty array', () => {
			expect(() => passTurn([])).toThrow(Error);
		});
	});

	describe('getters', () => {
		it('returns the correct role title', () => {
			expect(getRoleTitle(players[0].roleKey)).toBe(
				playerRoles[players[0].roleKey].title,
			);
		});

		it('returns the correct max water', () => {
			expect(getMaxWater(players[0].roleKey)).toBe(
				playerRoles[players[0].roleKey].maxWater,
			);
		});
	});

	describe('adjusting water', () => {
		it('adjusts water correctly', () => {
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

	describe('transferring items', () => {
		let tempPlayers = addItem(
			players,
			players[0].roleKey,
			createPlayerInventory({ flyingTool: 3 }),
		);
		it('accepts an item transfer', () => {
			tempPlayers = transferItems(
				tempPlayers,
				tempPlayers[0].roleKey,
				tempPlayers[1].roleKey,
				createPlayerInventory({ flyingTool: 1 }),
			);
			expect(tempPlayers[0].inventory.flyingTool).toBe(2);
			expect(tempPlayers[1].inventory.flyingTool).toBe(1);
		});

		it('rejects an item transfer', () => {
			tempPlayers = transferItems(
				tempPlayers,
				tempPlayers[0].roleKey,
				tempPlayers[1].roleKey,
				createPlayerInventory({ sandRemover: 1 }),
			);
			expect(tempPlayers[0].inventory.sandRemover).toBe(0);
			expect(tempPlayers[1].inventory.sandRemover).toBe(0);
		});
	});
});
