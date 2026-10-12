import { getTileIndex } from '@/features/action/actions';
import { findNeighboring, findSandPoints } from '@/features/board/tiles';
import GameInfoHeading from '../game-info/GameInfoHeading';
import GameInfoSection from '../game-info/GameInfoSection';
import { useGame } from '../utility/GameContext';

export default function ActionPanel() {
	const { state, dispatch } = useGame();
	const currentTileIndex = getTileIndex(state.board, state.players[0]);

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
		<GameInfoSection className="sticky bottom-0 z-20 flex flex-col justify-center items-center bg-slate-900/90 backdrop-blur-md border-slate-700/60 lg:top-0">
			<GameInfoHeading
				heading="Action Panel"
				subheading={`${state.actionCount} actions left`}
				className="hidden w-full lg:block lg:flex"
			/>
			{state.recentlyDrawnHurricaneCard && (
				<div className="w-full text-center py-1 px-3 bg-slate-800/80 rounded-lg border border-slate-700 text-sm flex justify-between items-center lg:hidden">
					<span className="text-slate-400 font-medium">Last Card:</span>
					<span className="font-bold text-amber-400">
						{state.recentlyDrawnHurricaneCard.type !== 'Move'
							? state.recentlyDrawnHurricaneCard.type
							: `Move ${state.recentlyDrawnHurricaneCard.distance} ${state.recentlyDrawnHurricaneCard.direction}`}
					</span>
				</div>
			)}

			{state.turnStatus && (
				<p className="text-center text-amber-400 font-semibold animate-pulse text-sm md:text-base">
					{state.turnStatus}
				</p>
			)}

			<div className="mt-5 flex flex-wrap justify-center gap-2 lg:m-0">
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
				<button
					type="button"
					disabled={state.isDrawingHurricaneCards || state.showEndTurnModal}
					className={`p-3 bg-red-600/70 rounded-lg font-semibold border motion-safe:transition ${
						state.isDrawingHurricaneCards || state.showEndTurnModal
							? 'brightness-50 cursor-not-allowed'
							: 'hover:bg-red-600 active:brightness-50'
					}`}
					onClick={() =>
						dispatch({ type: 'SET_SHOW_END_TURN_MODAL', show: true })
					}
				>
					End Turn
				</button>
			</div>
		</GameInfoSection>
	);
}
