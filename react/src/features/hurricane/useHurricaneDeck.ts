import { useState } from 'react';
import { type HurricaneCard, hurricaneCards } from './hurricane-cards';

const CARD_MAX_LIMITS = hurricaneCards.reduce(
	(acc, card) => {
		acc[card] = (acc[card] || 0) + 1;
		return acc;
	},
	{} as Record<HurricaneCard, number>,
);

const UNIQUE_CARD_TYPES = Array.from(
	new Set(hurricaneCards),
) as HurricaneCard[];

const INITIAL_COUNTS = UNIQUE_CARD_TYPES.reduce(
	(acc, card) => {
		acc[card] = 0;
		return acc;
	},
	{} as Record<HurricaneCard, number>,
);

export function useHurricaneDeck() {
	const [cardCounts, setCardCounts] =
		useState<Record<HurricaneCard, number>>(INITIAL_COUNTS);

	const drawnCardsCount = Object.values(cardCounts).reduce(
		(sum, count) => sum + count,
		0,
	);

	const drawHurricaneCard = (): HurricaneCard | null => {
		const currentTotal = Object.values(cardCounts).reduce(
			(sum, count) => sum + count,
			0,
		);

		const workingCounts =
			currentTotal >= hurricaneCards.length ? INITIAL_COUNTS : cardCounts;
		const availableCards = UNIQUE_CARD_TYPES.filter(
			(card) => workingCounts[card] < CARD_MAX_LIMITS[card],
		);

		if (availableCards.length === 0) return null;

		const drawnCard =
			availableCards[Math.floor(Math.random() * availableCards.length)];

		setCardCounts((prev) => {
			const countsToUse =
				Object.values(prev).reduce((sum, count) => sum + count, 0) >=
				hurricaneCards.length
					? INITIAL_COUNTS
					: prev;

			return {
				...countsToUse,
				[drawnCard]: countsToUse[drawnCard] + 1,
			};
		});

		return drawnCard;
	};

	return {
		cardCounts,
		drawnCardsCount,
		drawHurricaneCard,
	};
}
