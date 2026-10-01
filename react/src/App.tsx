import { useState } from 'react';
import Board from './features/board/components/Board';
import HurricaneDeck from './features/hurricane/HurricaneDeck';
import { useHurricaneDeck } from './features/hurricane/useHurricaneDeck';
import ItemDeck from './features/item/ItemDeck';
import type { Item } from './features/item/items';
import PlayerInfo from './features/player/PlayerInfo';
import PlayerSetup from './features/player/PlayerSetup';
import type { ActivePlayer } from './features/player/player-cards';

export default function App() {
	const [players, setPlayers] = useState<ActivePlayer[]>([]);
	const [discardedItems] = useState<Partial<Record<Item['type'], number>>>({});
	const { cardCounts, drawnCardsCount, drawHurricaneCard } = useHurricaneDeck();

	if (players.length === 0) {
		return <PlayerSetup onSelectPlayers={setPlayers} />;
	}

	return (
		<div className="grid w-fit p-5 md:grid-cols-2 grid-cols-1 items-start gap-15">
			<div>
				<div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
					<div className="min-w-[450px]">
						<Board players={players} />
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
	);
}
