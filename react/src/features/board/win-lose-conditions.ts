import { getStormConfig } from '../hurricane/hurricane-meter';
import type { PlayerCount } from '../player/player-cards';

interface LoseConditionsInput {
	playerCount: PlayerCount;
	currentIndex: number;
	players?: Array<{
		currentWaterLevel: number;
	}>;
	lastDrawnCard?: string | null;
	sandPointsPlaced?: number;
	sandPointsRemaining?: number;
}

export function winCondition(): boolean {
	return false;
}

export function loseConditions({
	playerCount,
	currentIndex,
	players = [],
	lastDrawnCard,
	sandPointsPlaced,
	sandPointsRemaining,
}: LoseConditionsInput): boolean {
	const config = getStormConfig(playerCount);
	const totalTicks = config.reduce((sum, tier) => sum + tier.tickCount, 0);
	const reachedSkull = currentIndex >= totalTicks;
	const thirstFailure =
		lastDrawnCard === 'Thirst' &&
		players.some((player) => player.currentWaterLevel <= 0);
	const placedMarks = sandPointsPlaced ?? 48 - (sandPointsRemaining ?? 0);
	const tooManySandPoints = placedMarks >= 49;

	return reachedSkull || thirstFailure || tooManySandPoints;
}
