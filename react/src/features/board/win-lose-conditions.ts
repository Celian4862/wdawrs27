import { getStormConfig } from '../hurricane/hurricane-meter';
import type { PlayerCount } from '../player/player-cards';

interface LoseConditionsInput {
	playerCount: PlayerCount;
	currentIndex: number;
	players?: Array<{
		currentWaterLevel: number;
	}>;
	lastDrawnCard?: string | null;
	sandMarksRemaining?: number;
}

export function winCondition(): boolean {
	return false;
}

export function loseConditions({
	playerCount,
	currentIndex,
	players = [],
	lastDrawnCard,
	sandMarksRemaining = 48,
}: LoseConditionsInput): boolean {
	const config = getStormConfig(playerCount);
	const totalTicks = config.reduce((sum, tier) => sum + tier.tickCount, 0);
	const reachedSkull = currentIndex >= totalTicks;
	const thirstFailure =
		lastDrawnCard === 'Thirst' &&
		players.some((player) => player.currentWaterLevel <= 0);
	const noSandMarks = sandMarksRemaining <= 0;

	return reachedSkull || thirstFailure || noSandMarks;
}
