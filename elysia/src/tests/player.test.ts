import { beforeAll, describe, expect, it } from 'bun:test';
import { playerRoles } from '@/player/data';
import { assignPlayers, passTurn } from '@/player/helpers';
import type { ActivePlayer } from '@/player/types';

describe('player unit tests', () => {
	let playerCount: number;
	let players: ActivePlayer[];
	beforeAll(() => {
		playerCount = 3;
		players = assignPlayers(playerCount);
	});
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

	it('rotates the player order correctly', () => {
		const originalFirst = players[0];
		const originalSecond = players[1];

		const rotatedPlayers = passTurn(players);

		expect(rotatedPlayers).toBeArrayOfSize(players.length);

		expect(rotatedPlayers[rotatedPlayers.length - 1]).toEqual(originalFirst);

		expect(rotatedPlayers[0]).toEqual(originalSecond);
	});

	it('throws an error when given an empty array', () => {
		expect(() => passTurn([])).toThrow(Error);
	});
});
