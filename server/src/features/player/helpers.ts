import { shuffle } from '../shuffle';
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

export function nextPlayer(players: ActivePlayer[]): ActivePlayer[] {
	if (players.length === 0) {
		throw new Error('Cannot rotate players: player array is empty');
	}
	const [current, ...remaining] = players;
	return [...remaining, current];
}
