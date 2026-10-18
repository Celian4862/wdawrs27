import { findNeighboring, findSandPoints } from '@/board/tiles';
import GameInfoHeading from '@/game-info/GameInfoHeading';
import GameInfoSection from '@/game-info/GameInfoSection';
import { useGame } from '@/utility/GameContext';
import { getPlayerTileIndex } from '@/utility/getTileIndex';

export default function ActionPanel() {
	const { state, dispatch } = useGame();
	const currentTileIndex = getPlayerTileIndex(state.board, state.players[0]);

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
				state.board[currentTileIndex].info?.parts.length === 0 ||
				!state.board[currentTileIndex].info?.revealed,
		},
		{
			name: 'Reveal Tile',
			disableCondition:
				(state.board[currentTileIndex].info?.sandPoints ?? 0) > 0 ||
				(state.board[currentTileIndex].info?.revealed ?? false),
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
				className="w-full lg:block lg:flex"
			/>
			{state.recentlyDrawnHurricaneCard && (
				<div className="w-full text-center py-1 px-3 mt-3 bg-slate-800/80 rounded-lg border border-slate-700 text-sm flex justify-between items-center lg:hidden">
					<span className="text-slate-400 font-medium">Last Card:</span>
					<span className="font-bold text-amber-400">
						{state.recentlyDrawnHurricaneCard.type !== 'Move'
							? state.recentlyDrawnHurricaneCard.type
							: `Move ${state.recentlyDrawnHurricaneCard.distance} ${state.recentlyDrawnHurricaneCard.direction}`}
					</span>
				</div>
			)}

			<div className="w-full flex flex-col lg:flex-col-reverse">
				{state.turnStatus && (
					<p className="mt-3 text-center text-amber-400 font-semibold animate-pulse text-sm md:text-base">
						{state.turnStatus}
					</p>
				)}
				<div className="relative">
					<details open className="mt-3">
						<summary className="mb-3 cursor-pointer">Main Actions</summary>
						<div className="mt-3 flex flex-wrap justify-center gap-2 lg:m-0">
							{actions.map((action) => (
								<div key={action.name} className="relative inline-block">
									{action.name === 'Collect Part' &&
										!action.disableCondition && <PingCircle />}
									<button
										type="button"
										disabled={disabled(action)}
										onClick={() => {
											if (
												state.isDrawingHurricaneCards ||
												action.disableCondition
											) {
												return;
											}

											if (action.name === 'Collect Part') {
												const board = [...state.board];
												const partsCollected = [...state.partsCollected];
												if (board[currentTileIndex].info) {
													const partToCollect =
														board[currentTileIndex].info.parts.pop();
													if (partToCollect) {
														partsCollected.push(partToCollect);
													}
												}
												dispatch({
													type: 'COLLECT_PART',
													board,
													partsCollected,
												});
											} else if (action.name === 'Reveal Tile') {
												dispatch({
													type: 'SET_SHOW_REVEAL_MODAL',
													prevAction: state.selectedAction,
													show: true,
												});
											}
											dispatch({
												type: 'SELECT_ACTION',
												action:
													state.selectedAction === action.name
														? null
														: action.name,
											});
										}}
										className={`p-3 border rounded-lg motion-safe:transition ${disabled(action) ? 'brightness-50' : action.name === 'Reveal Tile' ? 'bg-green-700 hover:bg-green-600' : 'hover:bg-yellow-600'} ${action.name !== 'Collect Part' && state.selectedAction === action.name ? `scale-115 ${action.name === 'Reveal Tile' ? 'bg-green-700' : 'bg-yellow-600 '}` : ''}`}
									>
										{action.name}
									</button>
								</div>
							))}
							<div className="relative inline-block">
								{state.actionCount === 0 && !state.isDrawingHurricaneCards && (
									<PingCircle />
								)}
								<button
									type="button"
									disabled={
										state.isDrawingHurricaneCards || state.showEndTurnModal
									}
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
						</div>
					</details>
					<details className="mt-3">
						<summary className="cursor-pointer">Role Actions</summary>
					</details>
				</div>
			</div>
		</GameInfoSection>
	);
}

function PingCircle() {
	return (
		<span className="absolute -top-1 -right-1 flex h-3 w-3">
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
			<span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
		</span>
	);
}
