import { getStormConfig } from '../hurricane/hurricane-meter';
import type { PlayerCount } from '../player/player-cards';

interface LoseConditionsInput {
	playerCount: PlayerCount;
	currentIndex: number;
	players?: Array<{
		currentWaterLevel: number;
	}>;
	lastDrawnCard?: string | null;
	sandMarksPlaced?: number;
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
	sandMarksPlaced,
	sandMarksRemaining,
}: LoseConditionsInput): boolean {
	const config = getStormConfig(playerCount);
	const totalTicks = config.reduce((sum, tier) => sum + tier.tickCount, 0);
	const reachedSkull = currentIndex >= totalTicks;
	const thirstFailure =
		lastDrawnCard === 'Thirst' &&
		players.some((player) => player.currentWaterLevel <= 0);
	const placedMarks = sandMarksPlaced ?? 48 - (sandMarksRemaining ?? 0);
	const tooManySandMarks = placedMarks >= 49;

	return reachedSkull || thirstFailure || tooManySandMarks;
}
