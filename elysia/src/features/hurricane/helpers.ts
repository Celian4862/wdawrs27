import { shuffle } from '../shared/helpers';
import { hurricaneDirections, hurricaneDistances } from './data';
import type { CardName, HurricaneCard } from './types';

export function shuffleHurricaneDeck(): readonly HurricaneCard[] {
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

export function countHurricaneCards(hurricaneDeck: readonly HurricaneCard[]) {
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

export function drawHurricaneCard(hurricaneDeck: readonly HurricaneCard[]) {
	const drawnCard = hurricaneDeck[-1];
	const newDeck = hurricaneDeck.slice(0, -1);
	return {
		drawnCard,
		hurricaneDeck: newDeck.length === 0 ? shuffleHurricaneDeck() : newDeck,
	};
}
