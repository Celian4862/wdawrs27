import Board from '@/components/Board';
import EndGameScreen from '@/components/EndGameScreen';
import { GameProvider, useGame } from '@/components/GameContext';
import DrawHurricaneCardsModal from '@/components/hurricane/hurricane-deck/DrawHurricaneCardsModal';
import HurricaneDeck from '@/components/hurricane/hurricane-deck/HurricaneDeckSection';
import ItemDeck from '@/components/ItemDeck';
import PlayerCards from '@/components/player/PlayerCards';
import ResetButton from '@/components/reset/ResetButton';
import ResetButtonModal from '@/components/reset/ResetButtonModal';
import Setup from '@/components/Setup';
import ActionPanel from './components/actions/ActionPanel';
import HurricaneMeter from './components/hurricane/hurricane-meter/HurricaneMeter';
import Parts from './components/Parts';
import RevealTileModal from './components/actions/RevealTileModal';

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
			<div className="lg:h-dvh w-screen p-10 pb-40 box-border grid grid-cols-1 gap-6 lg:pb-10 lg:grid-cols-11 lg:gap-10 xl:grid-cols-2">
				<div className="h-full flex flex-col gap-4 lg:min-h-0 lg:overflow-hidden lg:col-span-5 xl:col-span-1">
					<HurricaneMeter hurricaneMeter={state.hurricaneMeter} />
					<div className="flex-1 min-h-0 flex items-center justify-center">
						<Board />
					</div>
				</div>

				<div className="h-full min-h-0 lg:flex lg:flex-col lg:col-span-6 xl:col-span-1">
					<div className="pr-2 lg:h-full lg:overflow-y-auto">
						<section className="py-5 grid gap-5">
							<ActionPanel />
							<HurricaneDeck />
							<PlayerCards />
							<ItemDeck />
							<Parts />
							{/* Need to add a legend for the emojis to help players understand what they are */}
							<ResetButton />
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
