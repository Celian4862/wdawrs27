import ConfirmModalButtons from '@/components/ConfirmModalButtons';
import { useGame } from '@/components/GameContext';
import PopUp from '@/components/PopUp';
import { getTilePlayer } from '@/data/actions';
import { shuffleHurricaneDeck } from '@/data/shuffleHurricaneDeck';
import { sumSandPoints, toCoordinates, toIndex } from '@/data/tiles';

export default function DrawHurricaneCardsModal() {
	const { state, dispatch, getGameState } = useGame();
	const { currentPlayerIndex } = getTilePlayer(state.board, state.players);

	return (
		<PopUp
			show={state.showEndTurnModal}
			heading={`End ${state.players[currentPlayerIndex].role.title}'s Turn?`}
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
			let deckCounter = state.hurricaneDeckCounter;
			let deck = state.hurricaneDeck;
			let meterProgress = state.meterProgress;
			let currentBoard = [...state.board];
			let currentPlayers = [...state.players];

			for (let i = 0; i < state.hurricaneMeter[state.meterProgress]; i++) {
				await delay(1000);

				if (getGameState().gameId !== currentGameId) return;

				if (deckCounter >= 31) {
					deck = shuffleHurricaneDeck();
					deckCounter = 0;
					dispatch({ type: 'RESHUFFLE_DECK', deck });
				}

				const drawnCard = deck[deckCounter];

				dispatch({ type: 'DRAW_HURRICANE_CARD', card: drawnCard });

				if (drawnCard.type === 'Hurricane Up') {
					meterProgress++;
				} else if (drawnCard.type === 'Thirst') {
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
				} else {
					await delay(500);
					for (let j = 0; j < (drawnCard.distance ?? 0); j++) {
						if (getGameState().gameId !== currentGameId) return;

						const stormPosition = currentBoard.findIndex((tile) => !tile.info);
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
								reason: 'You had too many sand points',
							});
							return;
						}

						await delay(400);
					}
				}

				deckCounter++;

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

			let playerIndex = currentPlayers.findIndex((player) => player.isTurn);
			currentPlayers[playerIndex].isTurn = false;

			if (++playerIndex === currentPlayers.length) {
				playerIndex = 0;
			}
			currentPlayers[playerIndex].isTurn = true;
			currentPlayers = [...currentPlayers];
			// End of turn rest delay & notification phase
			dispatch({
				type: 'SET_TURN_STATUS',
				players: currentPlayers,
				status: 'Turn complete! Passing to next player...',
			});
			await delay(1500); // Guard delay to display message before unlocking UI
		} finally {
			if (getGameState().gameId === currentGameId) {
				dispatch({ type: 'FINISH_DRAWING' });
			}
		}
	}
}
