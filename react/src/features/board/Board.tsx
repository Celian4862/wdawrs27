import { findSandPoints } from '@/board/tiles';
import PawnCircle from '@/player/PawnCircle';
import { useGame } from '@/utility/GameContext';
import { parts } from '../part/parts';

export default function Board({ className }: { className?: string }) {
	const {
		state,
		dispatch,
		currentPlayer,
		currentTileIndex,
		hikerPlayer,
		findNeighboring,
	} = useGame();

	const neighboringTilePositions = findNeighboring(state.board);
	const validTiles =
		state.selectedAction === 'Move'
			? neighboringTilePositions.filter(
					(position) =>
						(state.board[position].info?.sandPoints ?? 2) < 2 ||
						position ===
							state.board.findIndex(
								(tile) => tile.id === hikerPlayer?.currentTileId,
							) ||
						currentPlayer === hikerPlayer,
				)
			: state.selectedAction === 'Remove Sand'
				? findSandPoints(
						state.board,
						currentTileIndex,
						neighboringTilePositions,
					)
				: [];
	const hasNoActions = state.actionCount === 0;
	const isMoveOrRemoveAction = ['Move', 'Remove Sand'].includes(
		state.selectedAction ?? '',
	);

	return (
		<section
			className={`aspect-square w-100 md:max-w-full box-border grid grid-cols-5 gap-2 lg:w-auto lg:h-full ${className ?? ''}`}
		>
			{state.board.map((tile, index) => {
				const isHurricane = !tile.info;
				const invalidTile = !validTiles.includes(index);

				return (
					<button
						key={tile.id}
						type="button"
						disabled={
							isHurricane ||
							!state.selectedAction ||
							invalidTile ||
							hasNoActions
						}
						className={`relative aspect-square border rounded-lg ease-in-out hover:duration-250 active:duration-100 motion-safe:transition-all ${isHurricane || (invalidTile && isMoveOrRemoveAction) ? 'brightness-50 cursor-not-allowed' : ''} ${!(isHurricane || invalidTile) && isMoveOrRemoveAction ? 'hover:scale-115 active:brightness-50' : ''} ${tile.info?.revealed ? tile.info.revealedTileColor : tile.info?.unrevealedTileColor}`}
						onClick={() => {
							switch (state.selectedAction) {
								case 'Move': {
									const newPlayers = [...state.players];
									newPlayers[0].currentTileId = tile.id;
									dispatch({ type: 'MOVE_TILES', players: newPlayers });
									break;
								}
								case 'Remove Sand': {
									const board = [...state.board];
									const targetTile = board[index];

									if (targetTile.info) {
										board[index] = {
											id: targetTile.id,
											info: {
												...targetTile.info,
												sandPoints:
													currentPlayer.role.title === 'Digger'
														? targetTile.info.sandPoints - 2
														: targetTile.info.sandPoints - 1,
											},
										};
									}
									dispatch({
										type: 'REMOVE_SAND',
										board,
										nextAction:
											findSandPoints(
												board,
												currentTileIndex,
												findNeighboring(board),
											).length === 0 && state.actionCount > 1,
									});
									break;
								}
							}
						}}
					>
						{!tile.info && '🌪'}
						{tile.info && tile.info.sandPoints > 0 && (
							<span
								className={`absolute -right-1 -top-1 lg:right-1 lg:top-1 border rounded-full px-1.5 py-0.5 text-[8px] font-bold text-slate-950 ${tile.info.sandPoints > 1 ? 'bg-orange-600' : 'bg-amber-500/90'} md:text-[10px] xl:px-2 xl:text-base`}
							>
								{tile.info.sandPoints}
							</span>
						)}

						<div className="absolute left-1 top-1 grid grid-rows-2 grid-flow-col rtl gap-0.5 items-start pointer-events-none">
							{state.players
								.filter((player) => player.currentTileId === tile.id)
								.map((player) => {
									const isCurrentPlayer = player.id === currentPlayer.id;
									return (
										<PawnCircle
											key={player.role.color}
											color={player.role.color}
											isCurrentPlayer={isCurrentPlayer}
											className={
												isCurrentPlayer ? 'motion-safe:animate-bounce' : ''
											}
										/>
									);
								})}
						</div>

						{tile.info && tile.info.parts.length > 0 && (
							<div className="absolute left-1 bottom-1 grid grid-rows-2 grid-flow-col ltr gap-0.5 items-start pointer-events-none">
								{tile.info.parts.map((part) => {
									return (
										<span key={part} className="bg-black text-xs">
											{parts.find((partInfo) => partInfo.part === part)?.emoji}
										</span>
									);
								})}
							</div>
						)}

						{tile.info?.orientationEmoji && (
							<span className="absolute -bottom-0.5 -right-1 text-sm leading-none md:text-lg lg:bottom-1 lg:right-1">
								{tile.info.revealed ? tile.info.orientationEmoji : ''}
							</span>
						)}
					</button>
				);
			})}
		</section>
	);
}
