import { describe, expect, it } from 'bun:test';
import {
	countHurricaneCards,
	shuffleHurricaneDeck,
} from '../features/hurricane/helpers';
import type { HurricaneCard } from '../features/hurricane/types';

describe('hurricane unit tests', () => {
	describe('shuffleHurricaneDeck()', () => {
		it('generates a deck with the correct total size', () => {
			const deck = shuffleHurricaneDeck();

			// 4 Thirst + 3 Hurricane Up + 12 (dist 1) + 8 (dist 2) + 4 (dist 3) = 31 cards
			expect(deck.length).toBe(31);
		});

		it('shuffles the deck so subsequent calls differ in order', () => {
			const deckA = shuffleHurricaneDeck();
			const deckB = shuffleHurricaneDeck();

			// Ensure they aren't generated in the exact same sequence
			expect(JSON.stringify(deckA)).not.toEqual(JSON.stringify(deckB));
		});
	});

	describe('countHurricaneCards()', () => {
		it('accurately tallies frequencies of cards in a deck', () => {
			// Create a small, predictable mock deck
			const mockDeck: HurricaneCard[] = [
				{ type: 'Thirst' },
				{ type: 'Thirst' },
				{ type: 'Hurricane Up' },
				{ type: 'Move', distance: 1, direction: 'Up' },
				{ type: 'Move', distance: 1, direction: 'Up' },
			];

			const counts = countHurricaneCards(mockDeck);

			expect(counts.Thirst).toBe(2);
			expect(counts['Hurricane Up']).toBe(1);
			expect(counts['Move Up 1']).toBe(2);
			expect(counts['Move Down 2']).toBeUndefined(); // or 0 depending on how you handle missing keys
		});
	});
});
