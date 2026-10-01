import { useState } from 'react';
import Board from './features/board/components/Board';
import LoseScreen from './features/board/components/LoseScreen';
import TileInfo from './features/board/components/TileInfo';
import { loseConditions } from './features/board/win-lose-conditions';
import HurricaneDeck from './features/hurricane/HurricaneDeck';
import HurricaneMeter from './features/hurricane/HurricaneMeter';
import { useHurricaneDeck } from './features/hurricane/useHurricaneDeck';
import ItemDeck from './features/item/ItemDeck';
import type { Item } from './features/item/items';
import PlayerInfo from './features/player/PlayerInfo';
import PlayerSetup from './features/player/PlayerSetup';
import type { ActivePlayer, PlayerCount } from './features/player/player-cards';

export default function App() {
	const [players, setPlayers] = useState<ActivePlayer[]>([]);
	const [discardedItems] = useState<Partial<Record<Item['type'], number>>>({});
	const [stormTrackTicks, setStormTrackTicks] = useState(0);
	const [lastDrawnCard, setLastDrawnCard] = useState<string | null>(null);
	const [sandMarksRemaining] = useState(48);
	const { cardCounts, drawnCardsCount, drawHurricaneCard } = useHurricaneDeck();
	const playerCount = players.length as PlayerCount;
	const isDefeated = loseConditions({
		playerCount,
		currentIndex: stormTrackTicks,
		players,
		lastDrawnCard,
		sandMarksRemaining,
	});

	const handleDrawHurricaneCard = () => {
		if (isDefeated) return;

		const drawnCard = drawHurricaneCard();
		setLastDrawnCard(drawnCard);

		if (drawnCard === 'Hurricane Up') {
			setStormTrackTicks((prev) => prev + 1);
		}
	};

	if (players.length === 0) {
		return <PlayerSetup onSelectPlayers={setPlayers} />;
	}

	return (
		<div className="relative">
			{isDefeated && <LoseScreen />}
			<div
				className={`grid w-fit p-5 md:grid-cols-2 grid-cols-1 items-start gap-15 ${
					isDefeated ? 'pointer-events-none opacity-60' : ''
				}`}
			>
				<div>
					<div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
						<div className="min-w-[450px]">
							<Board players={players} />
						</div>
					</div>
					<TileInfo className="mt-7" />
					<PlayerInfo players={players} />
				</div>
				<div>
					<HurricaneMeter
						playerCount={playerCount}
						currentIndex={stormTrackTicks}
					/>
					<HurricaneDeck
						cardCounts={cardCounts}
						drawnCardsCount={drawnCardsCount}
					/>
					{/* Button below is only for testing count increments */}
					<button
						type="button"
						onClick={handleDrawHurricaneCard}
						disabled={isDefeated}
						className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Draw random card
					</button>
					<ItemDeck discardedItems={discardedItems} />
				</div>
			</div>
		</div>
	);
}
