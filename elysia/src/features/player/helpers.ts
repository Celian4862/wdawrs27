import type { ItemKey } from '../item/types';
import { shuffle } from '../shared/helpers';
import { playerRoles, roleKeys } from './data';
import type {
	ActivePlayer,
	PlayerInventory,
	PlayerState,
	PlayerTitle,
	RoleKey,
} from './types';

/**
 * Assigns player roles randomly
 * @param playerCount Number of players (must be between 2 and 5)
 * @returns Next state of players array
 */
export function assignPlayers(playerCount: number): PlayerState {
	if (playerCount < 2 || playerCount > 5) {
		throw new Error('Must call assignPlayers() with 2-5 players');
	}
	const roles = shuffle(roleKeys).slice(0, playerCount);
	const minWaterIdx = roles.reduce(
		(minIdx, current, idx) =>
			playerRoles[current].maxWater < playerRoles[roles[minIdx]].maxWater
				? idx
				: minIdx,
		0,
	);

	return [
		...roles.slice(minWaterIdx),
		...roles.slice(0, minWaterIdx),
	].map<ActivePlayer>((role) => ({
		roleKey: role,
		currentWater: playerRoles[role].maxWater,
		tileId: 19,
		inventory: {
			sandRemover: 0,
			flyingTool: 0,
			thirstShield: 0,
			xRayGoggles: 0,
			addTwoWater: 0,
			speedBoost: 0,
		},
	}));
}

export function passTurn(players: PlayerState): PlayerState {
	if (players.length === 0) {
		throw new Error('Cannot rotate players: player array is empty');
	}
	const [current, ...remaining] = players;
	return [...remaining, current];
}

export function getRoleTitle(roleKey: RoleKey): PlayerTitle {
	return playerRoles[roleKey].title;
}

export function getMaxWater(roleKey: RoleKey): number {
	return playerRoles[roleKey].maxWater;
}

/**
 * Adjusts the water levels of all players with the given `roleKeys`
 * @param players Current state of players array
 * @param roleKeys Role keys of each player to adjust water
 * @param delta Positive or negative amount to adjust water
 * @returns Next state of players array
 */
export function adjustWater(
	players: PlayerState,
	roleKeys: Set<RoleKey>,
	delta: number,
): PlayerState {
	return players.map((player) => {
		if (roleKeys.has(player.roleKey)) {
			const newWater = Math.max(
				0,
				Math.min(getMaxWater(player.roleKey), player.currentWater + delta),
			);
			return {
				...player,
				currentWater: newWater,
			};
		}
		return player;
	});
}

/**
 * Transfers items from one player to another
 * @param players Current state of players array
 * @param giverRole `roleKey` of player giving the items
 * @param receiverRole `roleKey` of player receiving the items
 * @param itemsToGive `Record` of item type counts that the player wants to give
 * @returns Next state of players array
 */
export function transferItems(
	players: PlayerState,
	giverRole: RoleKey,
	receiverRole: RoleKey,
	itemsToGive: PlayerInventory,
): PlayerState {
	if (giverRole === receiverRole) {
		return players;
	}

	const giverIndex = players.findIndex((p) => p.roleKey === giverRole);
	const receiverIndex = players.findIndex((p) => p.roleKey === receiverRole);

	if (giverIndex === -1 || receiverIndex === -1) {
		return players;
	}

	const giver = players[giverIndex];
	const receiver = players[receiverIndex];

	// Validate that the giver has enough of ALL requested items
	for (const [itemKey, count] of Object.entries(itemsToGive) as [
		ItemKey,
		number,
	][]) {
		const currentCount = giver.inventory[itemKey];
		if (currentCount < count) {
			return players;
		}
	}

	// Perform Immutable Updates on Inventories
	const updatedGiverInventory = { ...giver.inventory };
	const updatedReceiverInventory = {
		...receiver.inventory,
	};

	for (const [itemKey, count] of Object.entries(itemsToGive) as [
		ItemKey,
		number,
	][]) {
		updatedGiverInventory[itemKey] -= count;
		updatedReceiverInventory[itemKey] += count;
	}

	const newPlayers = [...players];

	newPlayers[giverIndex] = {
		...giver,
		inventory: updatedGiverInventory,
	};

	newPlayers[receiverIndex] = {
		...receiver,
		inventory: updatedReceiverInventory,
	};

	return newPlayers;
}
