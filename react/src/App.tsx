import Board from '@/components/Board';
import EndGameScreen from '@/components/EndGameScreen';
import { GameProvider, useGame } from '@/components/GameContext';
import DrawHurricaneCardsModal from '@/components/hurricane/hurricane-deck/DrawHurricaneCardsModal';
import HurricaneDeckSection from '@/components/hurricane/hurricane-deck/HurricaneDeckSection';
import HurricaneMeterSection from '@/components/hurricane/hurricane-meter/HurricaneMeterSection';
import ItemDeck from '@/components/ItemDeck';
import PlayerCards from '@/components/player/PlayerCards';
import ResetButton from '@/components/reset/ResetButton';
import ResetButtonModal from '@/components/reset/ResetButtonModal';
import Setup from '@/components/Setup';

function GameContent() {
	const { state } = useGame();

	if (state.players.length === 0) {
		return <Setup playerSetup={true} />;
	}

	if (state.meterProgress < 0) {
		return <Setup playerSetup={false} />;
	}

	return (
		<div className="p-10 pb-40 grid items-right sm:pb-30 lg:pb-10 lg:grid-cols-7 xl:grid-cols-2">
			<EndGameScreen />
			<DrawHurricaneCardsModal />
			<ResetButtonModal />
			<Board className="lg:col-span-4 xl:col-span-1" />

			<section className="py-5 grid gap-5 lg:col-span-3 xl:col-span-1">
				<HurricaneMeterSection />
				<HurricaneDeckSection />
				<PlayerCards />
				<ItemDeck />
				<ResetButton />
			</section>
		</div>
	);
}

export default function App() {
	return (
		<GameProvider>
			<GameContent />
		</GameProvider>
	);
}
