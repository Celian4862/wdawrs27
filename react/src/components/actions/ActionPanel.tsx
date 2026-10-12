import { getTileIndex } from '@/data/actions';
import { findNeighboring, findSandPoints } from '@/data/tiles';
import { useGame } from '../GameContext';
import GameInfoHeading from '../game-info/GameInfoHeading';
import GameInfoSection from '../game-info/GameInfoSection';

export default function ActionPanel() {
	const { state, dispatch } = useGame();
	const currentTileIndex = getTileIndex(
		state.board,
		state.players[0],
	);

	const actions = [
		{
			name: 'Move',
			disableCondition:
				(state.board[currentTileIndex].info?.sandPoints ?? 0) > 1 &&
				state.players.find((player) => player.role.title === 'Hiker')
					?.currentTileId !== state.players[0].currentTileId,
		},
		{
			name: 'Remove Sand',
			disableCondition:
				findSandPoints(
					state.board,
					currentTileIndex,
					findNeighboring(
						state.board,
						currentTileIndex,
						state.players[0].role.title,
					),
				).length === 0,
		},
		{
			name: 'Collect Part',
			disableCondition:
				state.board[currentTileIndex].info?.partCount === 0 ||
				!state.board[currentTileIndex].info?.revealed,
		},
		{
			name: 'Reveal Tile',
			disableCondition:
				(state.board[currentTileIndex].info?.sandPoints ?? 0) > 0 ||
				state.board[currentTileIndex].info?.revealed,
		},
	];

	const disabled = (action: (typeof actions)[number]) =>
		action.disableCondition ||
		state.isDrawingHurricaneCards ||
		state.actionCount === 0;

	return (
		<GameInfoSection className="bg-slate-700 lg:sticky top-0 lg:z-30">
			<GameInfoHeading
				heading="Action Panel"
				subheading={`${state.actionCount} actions left`}
			/>
			<div className="flex flex-wrap gap-2">
				{actions.map((action) => (
					<button
						key={action.name}
						type="button"
						disabled={disabled(action)}
						onClick={() => {
							if (state.isDrawingHurricaneCards || action.disableCondition) {
								return;
							}
							if (action.name === 'Reveal Tile') {
								dispatch({
									type: 'SET_SHOW_REVEAL_MODAL',
									prevAction: state.selectedAction,
									show: true,
								});
							}
							dispatch({
								type: 'SELECT_ACTION',
								action:
									state.selectedAction === action.name ? null : action.name,
							});
						}}
						className={`p-3 border rounded-lg motion-safe:transition ${disabled(action) ? 'brightness-50' : 'hover:bg-yellow-600 active:scale-115'} ${state.selectedAction === action.name ? 'bg-yellow-600 scale-115' : ''}`}
					>
						{action.name}
					</button>
				))}
			</div>
		</GameInfoSection>
	);
}
