import { findSandPoints } from '@/board/tiles';
import GameInfoHeading from '@/game-info/GameInfoHeading';
import GameInfoSection from '@/game-info/GameInfoSection';
import { useGame } from '@/utility/GameContext';

export default function ActionPanel() {
	const { state, dispatch, currentPlayer, hikerPlayer, findNeighboring } =
		useGame();

	const currentTileIndex = state.board.findIndex(
		(tile) => tile.id === currentPlayer.currentTileId,
	);

	const actions = [
		{
			name: 'Move',
			disableCondition:
				(state.board[currentTileIndex].info?.sandPoints ?? 0) > 1 &&
				hikerPlayer?.currentTileId !== currentPlayer.currentTileId,
		},
		{
			name: 'Remove Sand',
			disableCondition:
				findSandPoints(
					state.board,
					currentTileIndex,
					findNeighboring(state.board),
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
		<GameInfoSection className="sticky bottom-0 z-20 flex flex-col items-center justify-center border-slate-700/60 bg-slate-900/90 backdrop-blur-md lg:top-0">
			<GameInfoHeading
				heading="Action Panel"
				subheading={`${state.actionCount} actions left`}
				className="w-full lg:block lg:flex"
			/>
			{state.recentlyDrawnHurricaneCard && (
				<div className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1 text-center text-sm lg:hidden">
					<span className="font-medium text-slate-400">Last Card:</span>
					<span className="font-bold text-amber-400">
						{state.recentlyDrawnHurricaneCard.type !== 'Move'
							? state.recentlyDrawnHurricaneCard.type
							: `Move ${state.recentlyDrawnHurricaneCard.distance} ${state.recentlyDrawnHurricaneCard.direction}`}
					</span>
				</div>
			)}

			<div className="flex w-full flex-col lg:flex-col-reverse">
				{state.turnStatus && (
					<p className="mt-3 animate-pulse text-center text-sm font-semibold text-amber-400 md:text-base">
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
												const tileInfo = board[currentTileIndex].info;
												if (tileInfo) {
													const partToCollect = tileInfo.parts.pop();
													board[currentTileIndex] = {
														...board[currentTileIndex],
														info: {
															...tileInfo,
														},
													};
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
										className={`rounded-lg border p-3 motion-safe:transition ${disabled(action) ? 'brightness-50' : action.name === 'Reveal Tile' ? 'bg-green-700 hover:bg-green-600' : 'hover:bg-yellow-600'} ${action.name !== 'Collect Part' && state.selectedAction === action.name ? `scale-115 ${action.name === 'Reveal Tile' ? 'bg-green-700' : 'bg-yellow-600'}` : ''}`}
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
									className={`rounded-lg border bg-red-600/70 p-3 font-semibold motion-safe:transition ${
										state.isDrawingHurricaneCards || state.showEndTurnModal
											? 'cursor-not-allowed brightness-50'
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
			<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
			<span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
		</span>
	);
}
