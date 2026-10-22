import ActionPanel from '@/action/ActionPanel';
import RevealTileModal from '@/action/RevealTileModal';
import Board from '@/board/Board';
import EndGameScreen from '@/EndGameScreen';
import DrawHurricaneCardsModal from '@/hurricane/hurricane-deck/DrawHurricaneCardsModal';
import HurricaneDeck from '@/hurricane/hurricane-deck/HurricaneDeckSection';
import ItemDeck from '@/item/ItemDeck';
import Legend from '@/Legend';
import PartsSection from '@/part/PartsSection';
import PlayerCards from '@/player/PlayerCards';
import ResetButton from '@/reset/ResetButton';
import ResetButtonModal from '@/reset/ResetButtonModal';
import { GameProvider, useGame } from '@/utility/GameContext';
import { DifficultySetup, PlayerSetup } from '@/utility/Setup';
import HurricaneMeter from './features/hurricane/hurricane-meter/HurricaneMeter';

function GameModals() {
	return (
		<>
			<EndGameScreen />
			<DrawHurricaneCardsModal />
			<ResetButtonModal />
			<RevealTileModal />
		</>
	);
}

function GameLayout() {
	const { state } = useGame();
	return (
		<div className="lg:h-dvh w-screen p-10 box-border grid grid-cols-1 gap-6 lg:pb-0 lg:grid-cols-11 lg:gap-10 xl:grid-cols-2">
			<div className="h-full flex flex-col gap-4 lg:pb-10 lg:min-h-0 lg:overflow-hidden lg:col-span-5 xl:col-span-1">
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
							<PartsSection />
							<Legend />
							<ResetButton />
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

function GameFlow() {
	const { state, dispatch } = useGame();
	if (state.players.length === 0) {
		return <PlayerSetup dispatch={dispatch} />;
	}

	if (state.meterProgress < 0) {
		return <DifficultySetup dispatch={dispatch} />;
	}

	return (
		<>
			<GameModals />
			<GameLayout />
		</>
	);
}

export default function App() {
	// const [state, dispatch] = useReducer(gameReducer, initialState);
	return (
		<GameProvider>
			<GameFlow />
		</GameProvider>
	);
}
