import { beforeAll, describe, expect, it } from 'bun:test';
import { assignPlayers, nextPlayer } from '../features/player/helpers';
import type { ActivePlayer } from '../features/player/types';

describe('player unit tests', () => {
	let playerCount: number;
	let players: ActivePlayer[];
	beforeAll(() => {
		playerCount = 3;
		players = assignPlayers(playerCount);
	});
	it('correctly initializes players', () => {
		expect(players).toBeArrayOfSize(playerCount);

		const seenIds = new Set<number>();
		const firstPlayerWater = players[0].water;

		players.forEach((player, index) => {
			// Check ID exists and is unique (no repeating IDs)
			expect(player.id).toBe(index);
			expect(seenIds.has(player.id)).toBe(false);
			seenIds.add(player.id);

			// Check water matches role's maxWater exactly
			expect(player.water).toBe(player.role.maxWater);

			// Check static starting properties
			expect(player.tileId).toBe(19);

			// Check first player's water is min

			expect(firstPlayerWater).toBeLessThanOrEqual(player.water);

			// Check items array starts empty
			expect(player.items).toBeEmpty();
		});
	});

	it('rotates the player order correctly', () => {
		const originalFirst = players[0];
		const originalSecond = players[1];

		const rotatedPlayers = nextPlayer(players);

		expect(rotatedPlayers).toBeArrayOfSize(players.length);

		expect(rotatedPlayers[rotatedPlayers.length - 1]).toEqual(originalFirst);

		expect(rotatedPlayers[0]).toEqual(originalSecond);
	});

	it('throws an error when given an empty array', () => {
		expect(() => nextPlayer([])).toThrow(Error);
	});
});
