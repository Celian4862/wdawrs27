import { shuffle } from '../shared/helpers';
import { hurricaneDirections, hurricaneDistances } from './data';
import type {
	CardName,
	Difficulty,
	HurricaneCard,
	HurricaneDeck,
	HurricaneMeter,
	HurricaneMeterTier,
} from './types';

export function setHurricaneMeter(
	playerCount: number,
	difficulty: Difficulty,
): HurricaneMeter {
	if (playerCount < 2 || playerCount > 5) {
		throw new Error(`Player count is not valid (${playerCount})`);
	}
	const initialTierConfig = [
		{ tier: 7, count: 1 },
		{ tier: 6, count: 2 },
		{ tier: 5, count: 3 },
		{ tier: 4, count: 4 },
		{ tier: 3, count: { 2: 3, 3: 4, 4: 4, 5: 5 }[playerCount] },
		{ tier: 2, count: 1 },
	];

	return {
		hurricaneMeter: initialTierConfig.flatMap<HurricaneMeterTier>(
			({ tier, count }) => Array(count).fill(tier),
		),
		meterProgress: { easy: 0, normal: 1, hard: 2, expert: 3 }[difficulty],
	};
}

export function raiseHurricaneMeter(meterProgress: number): number {
	return meterProgress + 1;
}

export function shuffleHurricaneDeck(): HurricaneDeck {
	return shuffle<HurricaneCard>([
		...Array<HurricaneCard>(4).fill({
			type: 'Thirst',
		}),
		...Array<HurricaneCard>(3).fill({
			type: 'Hurricane Up',
		}),
		...hurricaneDistances.flatMap((distance) => {
			const count = 4 - distance;

			return hurricaneDirections.flatMap((direction) =>
				Array<HurricaneCard>(count).fill({
					type: 'Move',
					distance,
					direction,
				}),
			);
		}),
	]);
}

export function countHurricaneCards(hurricaneDeck: HurricaneDeck) {
	const counts: Partial<Record<CardName, number>> = {};

	for (const card of hurricaneDeck) {
		const key: CardName =
			card.type === 'Move'
				? `Move ${card.direction} ${card.distance}`
				: card.type;

		counts[key] = (counts[key] || 0) + 1;
	}

	return counts;
}

export function drawHurricaneCard(hurricaneDeck: HurricaneDeck) {
	const drawnCard = hurricaneDeck[-1];
	const newDeck = hurricaneDeck.slice(0, -1);
	return {
		drawnCard,
		hurricaneDeck: newDeck.length === 0 ? shuffleHurricaneDeck() : newDeck,
	};
}
