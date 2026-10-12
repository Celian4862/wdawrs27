import ConfirmModalButtons from '../ConfirmModalButtons';
import { useGame } from '../GameContext';
import PopUp from '../PopUp';

export default function RevealTileModal() {
	const { state, dispatch } = useGame();

	return (
		<PopUp
			show={state.showRevealModal}
			heading={`Reveal ${state.players[0].role.title}'s tile?`}
			description="This action cannot be undone."
		>
			<ConfirmModalButtons
				confirmMessage="Confirm & Reveal"
				onCancel={() => {
					dispatch({ type: 'SELECT_ACTION', action: state.prevAction });
					dispatch({
						type: 'SET_SHOW_REVEAL_MODAL',
						prevAction: null,
						show: false,
					});
				}}
				onConfirm={() => {
					dispatch({
						type: 'SELECT_ACTION',
						action: state.actionCount === 1 ? null : state.prevAction,
					});
					dispatch({
						type: 'SET_SHOW_REVEAL_MODAL',
						prevAction: null,
						show: false,
					});

					const board = [...state.board];
					const targetTileIndex = board.findIndex(
						(tile) => tile.id === state.players[0].currentTileId,
					);
					const players = [...state.players];
					if (board[targetTileIndex].info) {
						board[targetTileIndex].info.revealed = true;
						switch (board[targetTileIndex].info.revealedType) {
							case 'Water':
								players.forEach((_, index, arr) => {
									if (arr[index].currentTileId === targetTileIndex) {
										arr[index].currentWaterLevel =
											arr[index].currentWaterLevel + 2 >
											arr[index].role.maxWater
												? arr[index].role.maxWater
												: arr[index].currentWaterLevel + 2;
									}
								});
								break;
							case 'Shade':
							case 'Item': {
								const items = [...state.itemDeck];
								const item = items.pop();
								if (item) {
									players[0].items.push(item);
									dispatch({ type: 'DRAW_ITEM_CARD', card: item.type, items });
								}
							}
						}
					}
					dispatch({
						type: 'REVEAL_TILE',
						board,
						players,
					});
				}}
			/>
		</PopUp>
	);
}
