import Board from '@/components/Board';
import EndGameScreen from '@/components/EndGameScreen';
import { GameProvider, useGame } from '@/components/GameContext';
import GameInfoHeading from '@/components/GameInfoHeading';
import DrawHurricaneCardsModal from '@/components/hurricane/hurricane-meter/DrawHurricaneCardsModal';
import HurricaneMeterSection from '@/components/hurricane/hurricane-meter/HurricaneMeterSection';
import Setup from '@/components/Setup';
import HurricaneDeckSection from './components/hurricane/hurricane-deck/HurricaneDeckSection';

function GameContent() {
	const { state } = useGame();

	if (state.playerCount === 0) {
		return <Setup playerSetup={true} />;
	}

	if (state.meterProgress < 0) {
		return <Setup playerSetup={false} />;
	}

	return (
		<div className="p-10 grid lg:grid-cols-2">
			<EndGameScreen />
			<DrawHurricaneCardsModal />
			<Board />

			<section className="py-5 grid gap-5">
				<HurricaneMeterSection />
				<HurricaneDeckSection />
				<section className="border rounded-xl p-6">
					<GameInfoHeading heading="Item Deck" subheading="" />
				</section>
				<section className="border rounded-xl p-6">
					<GameInfoHeading heading="Player Cards" subheading="" />
				</section>
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
