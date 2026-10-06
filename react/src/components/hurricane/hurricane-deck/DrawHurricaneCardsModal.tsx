import ConfirmModalButtons from '@/components/ConfirmModalButtons';
import { useGame } from '@/components/GameContext';
import PopUp from '@/components/PopUp';
import { shuffleHurricaneDeck } from '@/data/shuffleHurricaneDeck';

export default function DrawHurricaneCardsModal() {
	const { state, dispatch } = useGame();

	return (
		<PopUp
			show={state.showConfirmEndTurnModal}
			heading="End Your Turn?"
			description={
				<>
					This will automatically draw{' '}
					<strong className="text-amber-400">
						{state.hurricaneMeter[state.meterProgress]}
					</strong>{' '}
					Hurricane cards and advance to the next player.
				</>
			}
		>
			<ConfirmModalButtons
				confirmMessage="Confirm & Draw"
				onCancel={() =>
					dispatch({ type: 'SET_SHOW_CONFIRM_END_TURN_MODAL', show: false })
				}
				onConfirm={handleDrawHurricaneCards}
			/>
		</PopUp>
	);

	async function handleDrawHurricaneCards() {
		dispatch({ type: 'START_DRAWING' });

		const delay = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));

		try {
			let deckCounter = state.hurricaneDeckCounter;
			let deck = state.hurricaneDeck;
			let meterProgress = state.meterProgress;

			for (let i = 0; i < state.hurricaneMeter[state.meterProgress]; i++) {
				await delay(1000);

				if (deckCounter >= 31) {
					deck = shuffleHurricaneDeck();
					deckCounter = 0;
					dispatch({ type: 'RESHUFFLE_DECK', deck });
				}

				dispatch({ type: 'DRAW_HURRICANE_CARD', card: deck[deckCounter] });

				const drawnCard = deck[deckCounter];
				if (drawnCard.type === 'Hurricane Up') {
					meterProgress++;
				}
				deckCounter++;

				if (meterProgress === state.hurricaneMeter.length - 1) {
					await delay(1500);

					dispatch({
						type: 'GAME_OVER',
						reason: 'The Hurricane Meter reached its limit',
					});
					return;
				}
			}

			// End of turn rest delay & notification phase
			dispatch({
				type: 'SET_TURN_STATUS',
				status: 'Turn complete! Passing to next player...',
			});
			await delay(1500); // Guard delay to display message before unlocking UI
		} finally {
			dispatch({ type: 'FINISH_DRAWING' });
		}
	}
}
