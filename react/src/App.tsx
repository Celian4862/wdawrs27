import { useState } from 'react';
import Board from './features/board/Board';
import HurricaneDeck from './features/hurricane/HurricaneDeck';
import {
	type HurricaneCard,
	hurricaneCards,
} from './features/hurricane/hurricane-cards';
import ItemDeck from './features/item/ItemDeck';
import type { Item } from './features/item/items';
import PlayerInfo from './features/player/PlayerInfo';
import {
	assignPlayers,
	type PlayerType,
	playerCounts,
} from './features/player/player-cards';

const CARD_MAX_LIMITS = hurricaneCards.reduce((acc, card) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
}, {} as Record<HurricaneCard, number>);

export default function App() {
	const [players, setPlayers] = useState<PlayerType[]>([]);
	const [discardedItems] = useState<Partial<Record<Item['type'], number>>>({});
	// 1. Extract a unique list of card types to initialize our state and testing logic
	const cardTypes = Array.from(new Set(hurricaneCards)) as HurricaneCard[];
	// 2. Replace 14 useState hooks with a single dictionary state
	const [cardCounts, setCardCounts] = useState<Record<HurricaneCard, number>>(
		() => {
			return cardTypes.reduce(
				(acc, card) => {
					acc[card] = 0;
					return acc;
				},
				{} as Record<HurricaneCard, number>,
			);
		},
	);
	// 3. Dynamically sum up all drawn cards automatically
	const drawnCardsCount = Object.values(cardCounts).reduce(
		(sum, count) => sum + count,
		0,
	);
	// 4. Clean up the testing incrementer to pick a random card type
	const drawHurricaneCard = () => {
		setCardCounts((prev) => {
            const currentTotal = Object.values(prev).reduce((sum, count) => sum + count, 0);

			let workingCounts = prev;
            // Rule 2: If the deck hits 31 cards, reset everything back to 0
            if (currentTotal >= hurricaneCards.length) {
                workingCounts = cardTypes.reduce((acc, card) => {
                    acc[card] = 0;
                    return acc;
                }, {} as Record<HurricaneCard, number>);
            }

            // Rule 1: Filter out cards that have already reached their max limit
            const availableCards = cardTypes.filter(
                (card) => workingCounts[card] < CARD_MAX_LIMITS[card]
            );

            if (availableCards.length === 0) return workingCounts;

            // Pick randomly only from cards that still have copies left in the deck
            const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

            return {
                ...workingCounts,
                [randomCard]: workingCounts[randomCard] + 1,
            };
        });
	};

	return (
		<>
			{players.length !== 0 ? (
				<div className="grid w-fit md:grid-cols-2 grid-cols-1 items-start gap-15">
					<div>
						<div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
							<div className="min-w-[450px]">
							<Board />
							</div>
						</div>
						<PlayerInfo players={players} />
					</div>
					<div>
						<HurricaneDeck
							cardCounts={cardCounts}
							drawnCardsCount={drawnCardsCount}
						/>
						{/* Button below is only for testing count increments */}
						<button
							type="button"
							onClick={drawHurricaneCard}
							className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
						>
							Draw random card
						</button>
						<ItemDeck discardedItems={discardedItems} />
					</div>
				</div>
			) : (
				<div className="flex min-h-screen items-center justify-center p-6">
					<div className="w-full max-w-sm text-center">
						<p className="text-xl font-semibold text-white">
							How many players?
						</p>
						<div className="mt-6 grid grid-cols-2 gap-3">
							{playerCounts.map((count) => (
								<button
									key={count}
									type="button"
									onClick={() => {
										setPlayers(assignPlayers(count));
									}}
									className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-300/20 focus:outline-2 focus:outline-offset-2 focus:outline-cyan-300"
								>
									{count}
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
