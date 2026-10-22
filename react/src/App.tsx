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
		<div className="box-border grid w-screen grid-cols-1 gap-6 p-10 lg:h-dvh lg:grid-cols-11 lg:gap-10 lg:pb-0 xl:grid-cols-2">
			<div className="flex h-full flex-col gap-4 lg:col-span-5 lg:min-h-0 lg:overflow-hidden lg:pb-10 xl:col-span-1">
				<HurricaneMeter hurricaneMeter={state.hurricaneMeter} />
				<div className="flex min-h-0 flex-1 items-center justify-center">
					<Board />
				</div>
			</div>

			<div className="h-full min-h-0 lg:col-span-6 lg:flex lg:flex-col xl:col-span-1">
				<div className="pr-2 lg:h-full lg:overflow-y-auto">
					<section className="flex flex-col-reverse gap-5 py-5 lg:flex-col">
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
