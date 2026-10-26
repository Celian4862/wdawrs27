import { shuffle } from '@/shared/shuffle';
import { playerRoles } from './data';
import type { ActivePlayer } from './types';

export function assignPlayers(playerCount: number): ActivePlayer[] {
	const roles = shuffle(playerRoles).slice(0, playerCount);
	const minWaterIdx = roles.reduce(
		(minIdx, current, idx, arr) =>
			current.maxWater < arr[minIdx].maxWater ? idx : minIdx,
		0,
	);

	return [
		...roles.slice(minWaterIdx),
		...roles.slice(0, minWaterIdx),
	].map<ActivePlayer>((role, index) => ({
		id: index,
		role: role,
		water: role.maxWater,
		tileId: 19,
		items: [],
	}));
}

export function nextPlayer(players: readonly ActivePlayer[]): ActivePlayer[] {
	if (players.length === 0) {
		throw new Error('Cannot rotate players: player array is empty');
	}
	const [current, ...remaining] = players;
	return [...remaining, current];
}

export function adjustWater(
	players: readonly ActivePlayer[],
	indices: Set<number>,
	delta: number,
) {
	return players.map((player, i) => {
		if (indices.has(i)) {
			const newWater = Math.max(
				0,
				Math.min(player.role.maxWater, player.water + delta),
			);
			return {
				...player,
				water: newWater,
			};
		}
		return player;
	});
}
