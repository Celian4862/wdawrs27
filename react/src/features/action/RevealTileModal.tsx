import { toIndex } from '../board/tiles';
import ConfirmModalButtons from '../utility/ConfirmModalButtons';
import { useGame } from '../utility/GameContext';
import PopUp from '../utility/PopUp';

export default function RevealTileModal() {
	const { state, dispatch, currentPlayer } = useGame();

	const currentTileIndex = state.board.findIndex(
		(tile) => tile.id === currentPlayer.currentTileId,
	);

	return (
		<PopUp
			show={state.showRevealModal}
			heading={`Reveal ${currentPlayer.role.title}'s tile?`}
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

					const board = [...state.board];
					const tileInfo = board[currentTileIndex].info;

					if (!tileInfo) {
						throw new Error('Tile is not valid');
					}
					board[currentTileIndex] = {
						...board[currentTileIndex],
						info: {
							...tileInfo,
							revealed: true,
						},
					};

					const players = [...state.players];

					if (
						board[currentTileIndex].info?.revealedType === 'Shade' ||
						board[currentTileIndex].info?.revealedType === 'Item'
					) {
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
					} else if (board[currentTileIndex].info?.revealedType === 'Water') {
						players.forEach((player, index) => {
							if (player.currentTileId === state.board[currentTileIndex].id) {
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
					} else if (board[currentTileIndex].info?.revealedType === 'Hint') {
						const partHint = board[currentTileIndex].info?.partHint;
						const pairTileIndex = board.findIndex(
							(tile) =>
								tile.id !== board[currentTileIndex].id &&
								tile.info?.partHint === partHint,
						);
						if (pairTileIndex > -1 && board[pairTileIndex].info?.revealed) {
							const rowHintIndex =
								board[currentTileIndex].info?.partOrientation === 'Row'
									? currentTileIndex
									: pairTileIndex;
							const colHintIndex =
								currentTileIndex === rowHintIndex
									? pairTileIndex
									: currentTileIndex;

							const partTileIndex = toIndex(
								Math.floor(rowHintIndex / 5),
								colHintIndex % 5,
							);
							if (board[partTileIndex].info) {
								board[partTileIndex] = {
									...board[partTileIndex],
									info: {
										...board[partTileIndex].info,
										parts: [...board[partTileIndex].info.parts, partHint ?? ''],
									},
								};
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
