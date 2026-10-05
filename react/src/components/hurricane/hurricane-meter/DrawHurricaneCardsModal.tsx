import { useGame } from '@/components/GameContext';
import PopUp from '@/components/PopUp';
import { shuffleHurricaneCards } from '@/data/shuffleHurricaneCards';

export default function DrawHurricaneCardsModal() {
	const { state, dispatch } = useGame();

	return (
		<PopUp
			className={
				state.showConfirmEndTurnModal
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			}
		>
			<h3 className="text-2xl font-bold">End Your Turn?</h3>
			<p className="text-slate-300">
				This will automatically draw{' '}
				<strong className="text-amber-400">
					{state.hurricaneMeter[state.hurricaneDeckCounter]}
				</strong>{' '}
				Hurricane cards and advance to the next player.
			</p>
			<div className="pt-2 flex flex-col gap-3 justify-center md:flex-row">
				<button
					type="button"
					className="px-5 py-2 bg-red-600 hover:bg-red-700 font-bold rounded-lg transition"
					onClick={handleDrawHurricaneCards}
				>
					Confirm & Draw
				</button>
				<button
					type="button"
					className="px-5 py-2 border rounded-lg hover:bg-slate-800 transition"
					onClick={() =>
						dispatch({ type: 'SET_SHOW_CONFIRM_MODAL', show: false })
					}
				>
					Cancel
				</button>
			</div>
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
					deck = shuffleHurricaneCards();
					deckCounter = 0;
					dispatch({ type: 'RESHUFFLE_DECK', deck });
				}

				dispatch({ type: 'DRAW_SINGLE_CARD', card: deck[deckCounter] });


				const drawnCard = deck[deckCounter]
				if (drawnCard === 'Hurricane Up') {
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
