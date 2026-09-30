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

	const drawHurricaneCard = () => {
		setCardCounts((prev) => {
			const currentTotal = Object.values(prev).reduce(
				(sum, count) => sum + count,
				0,
			);

			let workingCounts = prev;
			if (currentTotal >= hurricaneCards.length) {
				workingCounts = INITIAL_COUNTS;
			}

			const availableCards = UNIQUE_CARD_TYPES.filter(
				(card) => workingCounts[card] < CARD_MAX_LIMITS[card],
			);

			if (availableCards.length === 0) return workingCounts;

			const randomCard =
				availableCards[Math.floor(Math.random() * availableCards.length)];

			return {
				...workingCounts,
				[randomCard]: workingCounts[randomCard] + 1,
			};
		});
	};

	return {
		cardCounts,
		drawnCardsCount,
		drawHurricaneCard,
	};
}
