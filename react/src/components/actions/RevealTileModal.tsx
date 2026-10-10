import { getTilePlayer } from '@/data/actions';
import ConfirmModalButtons from '../ConfirmModalButtons';
import { useGame } from '../GameContext';
import PopUp from '../PopUp';

export default function RevealTileModal() {
	const { state, dispatch } = useGame();

	const { currentPlayerIndex } = getTilePlayer(state.board, state.players);

	return (
		<PopUp
			show={state.showRevealModal}
			heading={`Reveal ${state.players[currentPlayerIndex].role.title}'s tile?`}
			description="This action cannot be undone."
		>
			<ConfirmModalButtons
				confirmMessage="Confirm & Reveal"
				onCancel={() => {
					dispatch({ type: 'SET_SHOW_REVEAL_MODAL', show: false });
					dispatch({ type: 'SELECT_ACTION', action: null });
				}}
				onConfirm={() => {
					dispatch({ type: 'SET_SHOW_REVEAL_MODAL', show: false });
					dispatch({ type: 'SELECT_ACTION', action: null });

					const board = [...state.board];
					const targetTileIndex = board.findIndex(
						(tile) => tile.id === state.players[currentPlayerIndex].currentTileId,
					);
					const players = [...state.players];
					if (board[targetTileIndex].info) {
						board[targetTileIndex].info.revealed = true;
						if (board[targetTileIndex].info.revealedType === 'Water') {
							players.forEach((_, index, arr) => {
								if (arr[index].currentTileId === targetTileIndex) {
									arr[index].currentWaterLevel = arr[index].currentWaterLevel + 2 > arr[index].role.maxWater ? arr[index].role.maxWater : arr[index].currentWaterLevel + 2;
								}
							});
						}
					}
					dispatch({
						type: 'REVEAL_TILE',
						board,
						players
					});
				}}
			/>
		</PopUp>
	);
}
