import { produce } from "immer";
import type { ItemKey } from "../item/types";
import { shuffle } from "../shared/helpers";
import { playerRoles, roleKeys } from "./data";
import type {
	ActivePlayer,
	PlayerInventory,
	PlayerState,
	RoleKey,
} from "./types";

/**
 * Assigns player roles randomly
 * @param playerCount Number of players (must be between 2 and 5)
 * @returns Next state of players array
 */
export function assignPlayers(playerCount: number): PlayerState {
	if (playerCount < 2 || playerCount > 5) {
		throw new Error("Must call assignPlayers() with 2-5 players");
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
		inventory: createPlayerInventory(),
	}));
}

export function passTurn(players: PlayerState): PlayerState {
	if (players.length < 2) {
		throw new Error('Invalid "players" array length');
	}
	const [current, ...remaining] = players;
	return [...remaining, current];
}

export function getRoleTitle(roleKey: RoleKey) {
	return playerRoles[roleKey].title;
}

export function getMaxWater(roleKey: RoleKey) {
	return playerRoles[roleKey].maxWater;
}

export function getRoleAbility(roleKey: RoleKey) {
	return playerRoles[roleKey].ability;
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
 * Initializes a PlayerInventory object.
 *
 * The parameter is an object so that choosing which object values to set is easier.
 * @param initialInventory Object with items to initialize the inventory with.
 * @returns Initialized PlayerInventory object.
 */
export function createPlayerInventory(
	initialInventory: Partial<PlayerInventory> = {},
): PlayerInventory {
	return {
		sandRemover: 0,
		flyingTool: 0,
		thirstShield: 0,
		xRayGoggles: 0,
		addTwoWater: 0,
		speedBoost: 0,
		...initialInventory,
	};
}

export function sumPlayerInventory(playerInventory: PlayerInventory) {
	return Object.values(playerInventory).reduce(
		(sum, current) => sum + current,
		0,
	);
}

export function addItems(
	players: PlayerState,
	targetRoleKey: RoleKey,
	itemsToAdd: PlayerInventory,
): PlayerState {
	return produce(players, (draft) => {
		const targetPlayer = draft.find((p) => p.roleKey === targetRoleKey);

		if (!targetPlayer) {
			return;
		}

		for (const [itemKey, count] of Object.entries(itemsToAdd) as [
			ItemKey,
			number,
		][]) {
			targetPlayer.inventory[itemKey] += count;
		}
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

	return produce(players, (draft) => {
		const giver = draft.find((p) => p.roleKey === giverRole);
		const receiver = draft.find((p) => p.roleKey === receiverRole);

		if (!giver || !receiver) {
			return;
		}

		let noItems = true;
		// Validate that the giver has enough of ALL requested items
		for (const [itemKey, count] of Object.entries(itemsToGive) as [
			ItemKey,
			number,
		][]) {
			if (giver.inventory[itemKey] < count) {
				return;
			}
			if (count > 0) {
				noItems = false;
			}
		}
		if (noItems) {
			return;
		}

		for (const [itemKey, count] of Object.entries(itemsToGive) as [
			ItemKey,
			number,
		][]) {
			giver.inventory[itemKey] -= count;
			receiver.inventory[itemKey] += count;
		}
	});
}
