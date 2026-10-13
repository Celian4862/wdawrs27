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
				className="bg-green-700 hover:bg-green-500 active:bg-red-700"
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

					const targetTile = state.board.find((t) => t.id === targetTileId);
					const revealedType = targetTile?.info?.revealedType;

					// 2. Immutably update the players array and objects
					const items = [...state.itemDeck];
					let drawnItem = null;
					if (revealedType === 'Shade' || revealedType === 'Item') {
						drawnItem = items.pop();
						if (drawnItem) {
							dispatch({ type: 'DRAW_ITEM_CARD', card: drawnItem.type, items });
						}
					}

					const players = state.players.map((player, index) => {
						// Copy the player object
						const updatedPlayer = { ...player };

						// Handle Water logic
						if (
							revealedType === 'Water' &&
							player.currentTileId === state.players[0].currentTileId
						) {
							const newWater = updatedPlayer.currentWaterLevel + 2;
							updatedPlayer.currentWaterLevel =
								newWater > updatedPlayer.role.maxWater
									? updatedPlayer.role.maxWater
									: newWater;
						}

						// Handle Item/Shade logic for player 0
						if (
							(revealedType === 'Shade' || revealedType === 'Item') &&
							index === 0 &&
							drawnItem
						) {
							updatedPlayer.items = [...updatedPlayer.items, drawnItem];
						}

						return updatedPlayer;
					});
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
