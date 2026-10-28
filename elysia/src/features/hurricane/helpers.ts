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

export function setHurricaneMeter(difficulty: Difficulty): HurricaneMeter {
	const initialTierConfig = [
		{ tier: 7, count: 1 },
		{ tier: 6, count: 2 },
		{ tier: 5, count: 3 },
		{ tier: 4, count: 4 },
		{
			tier: 3,
			count:
				difficulty === 'easy'
					? 3
					: difficulty === 'normal' || difficulty === 'hard'
						? 4
						: 5,
		},
		{ tier: 2, count: 1 },
	];

	return initialTierConfig.flatMap<HurricaneMeterTier>(({ tier, count }) =>
		Array(count).fill(tier),
	);
}

export function raiseHurricaneMeter(meter: HurricaneMeter): HurricaneMeter {
	return meter.slice(0, -1);
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
