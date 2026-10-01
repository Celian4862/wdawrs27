// ==========================================
// 1. TYPES & CONFIGURATION (Static Rules)
// ==========================================

import type { PlayerCount } from "../player/player-cards";

export interface StormLevelTier {
	cardCount: number; // e.g., 2, 3, 4, 5, 6
	tickCount: number; // How many ticks this level has
}

// Level 3 is the only tier whose tick count changes based on player count
const LEVEL_3_TICKS_BY_PLAYERS: Record<PlayerCount, number> = {
	2: 3,
	3: 4,
	4: 4,
	5: 5,
};

/**
 * Returns the full storm track configuration for a given player count.
 */
export const getStormConfig = (playerCount: PlayerCount): StormLevelTier[] => {
	const level3Ticks = LEVEL_3_TICKS_BY_PLAYERS[playerCount] ?? 4;

	return [
		{
			cardCount: 2,
			tickCount: 1,
		},
		{
			cardCount: 3,
			tickCount: level3Ticks,
		},
		{
			cardCount: 4,
			tickCount: 4,
		},
		{
			cardCount: 5,
			tickCount: 3,
		},
		{
			cardCount: 6,
			tickCount: 2,
		},
	];
};

// ==========================================
// 2. RUNTIME HELPERS (Game Logic)
// ==========================================

/**
 * Calculates how many cards to draw right now based on the current track index and player count.
 * Returns null if the index exceeds the max track (Game Over / Loss).
 */
export const getCurrentCardDrawCount = (
	playerCount: PlayerCount,
	currentIndex: number,
): number | null => {
	const config = getStormConfig(playerCount);
	let accumulatedTicks = 0;

	for (const tier of config) {
		accumulatedTicks += tier.tickCount;
		if (currentIndex < accumulatedTicks) {
			return tier.cardCount;
		}
	}

	return null; // Exceeded max track -> Defeat condition!
};
