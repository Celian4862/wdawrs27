import ConfirmModalButtons from '../utility/ConfirmModalButtons';
import { useGame } from '../utility/GameContext';
import PopUp from '../utility/PopUp';

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
				className="bg-green-700 hover:bg-green-500 active:bg-green-600"
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

					const targetTileId = state.players[0].currentTileId;
					const board = state.board.map((tile) => {
						if (tile.id === targetTileId && tile.info) {
							return {
								...tile,
								info: { ...tile.info, revealed: true },
							};
						}
						return tile;
					});

					const players = [...state.players];
					const revealedType = state.board.find((t) => t.id === targetTileId)
						?.info?.revealedType;

					if (revealedType === 'Shade' || revealedType === 'Item') {
						const items = [...state.itemDeck];
						let drawnItem = null;
						drawnItem = items.pop();
						if (drawnItem) {
							dispatch({ type: 'DRAW_ITEM_CARD', card: drawnItem.type, items });
							players[0] = {
								...players[0],
								items: [...players[0].items, drawnItem],
							};
						}
					} else if (revealedType === 'Water') {
						players.forEach((player, index) => {
							if (player.currentTileId === targetTileId) {
								const newWater = player.currentWaterLevel + 2;
								players[index] = {
									...player,
									currentWaterLevel:
										newWater > player.role.maxWater
											? player.role.maxWater
											: newWater,
								};
							}
						});
					} else if (revealedType === 'Hint') {
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
