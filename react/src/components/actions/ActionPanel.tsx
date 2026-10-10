import { getTilePlayer } from '@/data/actions';
import { findNeighboring, findSandPoints } from '@/data/tiles';
import { useGame } from '../GameContext';
import GameInfoHeading from '../game-info/GameInfoHeading';
import GameInfoSection from '../game-info/GameInfoSection';

export default function ActionPanel() {
	const { state, dispatch } = useGame();
	const { currentPlayer, currentTileInfo } = getTilePlayer(
		state.board,
		state.players,
	);
	const currentPosition = state.board.findIndex(
		(tile) => tile.id === currentPlayer.currentTileId,
	);

	const actions = [
		{
			name: 'Move',
			disableCondition:
				currentTileInfo.sandPoints > 1 &&
				state.players.find((player) => player.role.title === 'Hiker')
					?.currentTileId !== currentPlayer.currentTileId,
		},
		{
			name: 'Remove Sand',
			disableCondition:
				findSandPoints(
					state.board,
					currentPosition,
					findNeighboring(currentPosition, currentPlayer.role.title),
				).length === 0,
		},
		{
			name: 'Collect Part',
			disableCondition:
				currentTileInfo.partCount === 0 || !currentTileInfo.revealed,
		},
		{
			name: 'Reveal Tile',
			disableCondition:
				currentTileInfo.sandPoints > 0 || currentTileInfo.revealed,
		},
	];

	return (
		<GameInfoSection className="bg-slate-700 lg:sticky top-0 lg:z-30">
			<GameInfoHeading heading="Action Panel" subheading="" />
			<div className="flex flex-wrap gap-2">
				{actions.map((action) => (
					<button
						key={action.name}
						type="button"
						disabled={action.disableCondition || state.isDrawingHurricaneCards}
						onClick={() => {
							if (state.isDrawingHurricaneCards || action.disableCondition) {
								return;
							}
							dispatch({
								type: 'SELECT_ACTION',
								action:
									state.selectedAction === action.name ? null : action.name,
							});
							if (action.name === 'Reveal Tile') {
								dispatch({ type: 'SET_SHOW_REVEAL_MODAL', show: true });
							}
						}}
						className={`p-3 border rounded-lg motion-safe:transition ${action.disableCondition || state.isDrawingHurricaneCards ? 'brightness-50' : 'hover:bg-yellow-600 active:scale-115'} ${state.selectedAction === action.name ? 'bg-yellow-600 scale-115' : ''}`}
					>
						{action.name}
					</button>
				))}
			</div>
		</GameInfoSection>
	);
}
