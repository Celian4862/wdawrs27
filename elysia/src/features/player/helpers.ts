import type { ItemKey } from '@/item/types';
import { shuffle } from '@/shared/shuffle';
import { playerRoles, roleKeys } from './data';
import type {
	ActivePlayer,
	PlayerInventory,
	PlayerTitle,
	RoleKey,
} from './types';

export function assignPlayers(playerCount: number): ActivePlayer[] {
	if (playerCount < 2 || playerCount > 5) {
		return [];
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

export function passTurn(players: readonly ActivePlayer[]): ActivePlayer[] {
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

export function adjustWater(
	players: readonly ActivePlayer[],
	indices: Set<number>,
	delta: number,
) {
	return players.map((player, i) => {
		if (indices.has(i)) {
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

export function transferItems(
	players: readonly ActivePlayer[],
	giverRole: RoleKey,
	receiverRole: RoleKey,
	itemsToGive: PlayerInventory,
): readonly ActivePlayer[] {
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
	const updatedGiverInventory: PlayerInventory = { ...giver.inventory };
	const updatedReceiverInventory: PlayerInventory = {
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
