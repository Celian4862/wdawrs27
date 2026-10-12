import { sumSandPoints, toCoordinates, toIndex } from '@/features/board/tiles';
import { shuffleHurricaneDeck } from '@/features/hurricane/hurricane-deck/hurricaneDeck';
import { cyclePlayers } from '@/features/player/players';
import ConfirmModalButtons from '@/features/utility/ConfirmModalButtons';
import { useGame } from '@/features/utility/GameContext';
import PopUp from '@/features/utility/PopUp';

export default function DrawHurricaneCardsModal() {
	const { state, dispatch, getGameState } = useGame();

	return (
		<PopUp
			show={state.showEndTurnModal}
			heading={`End ${state.players[0].role.title}'s Turn?`}
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
					dispatch({ type: 'SET_SHOW_END_TURN_MODAL', show: false })
				}
				onConfirm={handleDrawHurricaneCards}
			/>
		</PopUp>
	);

	async function handleDrawHurricaneCards() {
		const currentGameId = state.gameId;
		dispatch({ type: 'START_DRAWING' });

		const delay = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));

		try {
			let deck = [...state.hurricaneDeck];
			let meterProgress = state.meterProgress;
			let currentBoard = [...state.board];
			let currentPlayers = [...state.players];

			for (let i = 0; i < state.hurricaneMeter[state.meterProgress]; i++) {
				await delay(1000);

				if (getGameState().gameId !== currentGameId) return;

				if (deck.length === 0) {
					deck = shuffleHurricaneDeck();
					dispatch({ type: 'RESHUFFLE_DECK', deck });
				}

				const drawnCard = deck.pop();

				if (drawnCard) {
					dispatch({ type: 'DRAW_HURRICANE_CARD', deck, card: drawnCard });
					switch (drawnCard.type) {
						case 'Hurricane Up':
							meterProgress++;
							break;
						case 'Thirst': {
							let endGame = false;

							for (let j = 0; j < currentPlayers.length; j++) {
								if (getGameState().gameId !== currentGameId) return;

								if (
									currentBoard[
										currentBoard.findIndex(
											(tile) => tile.id === currentPlayers[j].currentTileId,
										)
									].info?.revealedType !== 'Shade'
								) {
									if (--currentPlayers[j].currentWaterLevel < 0) {
										endGame = true;
									}
								}
							}
							currentPlayers = [...currentPlayers];
							dispatch({ type: 'DRINK_WATER', players: currentPlayers });
							if (endGame) {
								await delay(1500);
								if (getGameState().gameId !== currentGameId) return;

								dispatch({
									type: 'GAME_OVER',
									reason: 'One or more players died of thirst',
								});
								return;
							}
							break;
						}
						default:
							await delay(400);
							for (let j = 0; j < (drawnCard.distance ?? 0); j++) {
								if (getGameState().gameId !== currentGameId) return;

								const stormPosition = currentBoard.findIndex(
									(tile) => !tile.info,
								);
								const [stormRow, stormCol] = toCoordinates(stormPosition);

								let targetRow = stormRow;
								let targetCol = stormCol;

								if (drawnCard.direction === 'Up') targetRow--;
								else if (drawnCard.direction === 'Down') targetRow++;
								else if (drawnCard.direction === 'Left') targetCol--;
								else if (drawnCard.direction === 'Right') targetCol++;

								if (
									targetRow < 0 ||
									targetRow > 4 ||
									targetCol < 0 ||
									targetCol > 4
								) {
									break;
								}

								const otherTile = toIndex(targetRow, targetCol);

								const nextBoard = [...currentBoard];
								if (nextBoard[otherTile].info) {
									nextBoard[otherTile].info.sandPoints++;
								}
								[nextBoard[stormPosition], nextBoard[otherTile]] = [
									nextBoard[otherTile],
									nextBoard[stormPosition],
								];

								currentBoard = nextBoard;
								dispatch({ type: 'MOVE_HURRICANE', board: currentBoard });

								if (sumSandPoints(currentBoard) > 48) {
									await delay(1500);
									if (getGameState().gameId !== currentGameId) return;

									dispatch({
										type: 'GAME_OVER',
										reason: 'You ran out of sand points',
									});
									return;
								}

								await delay(300);
							}
					}
				}
				deck = [...deck];

				if (meterProgress === state.hurricaneMeter.length - 1) {
					await delay(1500);
					if (getGameState().gameId !== currentGameId) return;

					dispatch({
						type: 'GAME_OVER',
						reason: 'The Hurricane Meter reached its limit',
					});
					return;
				}
			}

			currentPlayers = cyclePlayers(currentPlayers);

			// End of turn rest delay & notification phase
			dispatch({
				type: 'SET_TURN_STATUS',
				players: currentPlayers,
				status: 'Turn complete! Passing to next player...',
				turnCount:
					currentPlayers[0].id === state.firstPlayerId
						? state.turnCount + 1
						: state.turnCount,
			});
			await delay(1500); // Guard delay to display message before unlocking UI
		} finally {
			if (getGameState().gameId === currentGameId) {
				dispatch({ type: 'FINISH_DRAWING' });
			}
		}
	}
}
