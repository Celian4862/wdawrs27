import ActionPanel from '@/features/action/ActionPanel';
import RevealTileModal from '@/features/action/RevealTileModal';
import Board from '@/features/board/Board';
import EndGameScreen from '@/features/EndGameScreen';
import DrawHurricaneCardsModal from '@/features/hurricane/hurricane-deck/DrawHurricaneCardsModal';
import HurricaneDeck from '@/features/hurricane/hurricane-deck/HurricaneDeckSection';
import ItemDeck from '@/features/item/ItemDeck';
import Legend from '@/features/Legend';
import Parts from '@/features/part/Parts';
import PlayerCards from '@/features/player/PlayerCards';
import ResetButton from '@/features/reset/ResetButton';
import ResetButtonModal from '@/features/reset/ResetButtonModal';
import { GameProvider, useGame } from '@/features/utility/GameContext';
import Setup from '@/features/utility/Setup';
import HurricaneMeter from './features/hurricane/hurricane-meter/HurricaneMeter';

function GameContent() {
	const { state } = useGame();

	if (state.players.length === 0) {
		return <Setup playerSetup={true} />;
	}

	if (state.meterProgress < 0) {
		return <Setup playerSetup={false} />;
	}

	return (
		<>
			<EndGameScreen />
			<DrawHurricaneCardsModal />
			<ResetButtonModal />
			<RevealTileModal />
			<div className="lg:h-dvh w-screen p-10 box-border grid grid-cols-1 gap-6 lg:grid-cols-11 lg:gap-10 xl:grid-cols-2">
				<div className="h-full flex flex-col gap-4 lg:min-h-0 lg:overflow-hidden lg:col-span-5 xl:col-span-1">
					<HurricaneMeter hurricaneMeter={state.hurricaneMeter} />
					<div className="flex-1 min-h-0 flex items-center justify-center">
						<Board />
					</div>
				</div>

				<div className="h-full min-h-0 lg:flex lg:flex-col lg:col-span-6 xl:col-span-1">
					<div className="pr-2 lg:h-full lg:overflow-y-auto">
						<section className="py-5 flex flex-col-reverse gap-5 lg:flex-col">
							<ActionPanel />
							<div className="flex flex-col gap-5">
								<PlayerCards />
								<HurricaneDeck />
								<ItemDeck />
								<Parts />
								<Legend />
								<ResetButton />
							</div>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}

export default function App() {
	return (
		<GameProvider>
			<GameContent />
		</GameProvider>
	);
}
