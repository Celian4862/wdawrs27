import {
	findMoveable,
	findNeighboring,
	findSandPoints,
} from '@/features/board/tiles';
import PawnCircle from '@/features/player/PawnCircle';
import { useGame } from '@/features/utility/GameContext';
import { getTileIndex } from '@/features/utility/getTileIndex';

export default function Board({ className }: { className?: string }) {
	const { state, dispatch } = useGame();

	const currentTileIndex = getTileIndex(state.board, state.players[0]);
	const hikerPosition = (() => {
		const hikerIndex = state.players.findIndex(
			(player) => player.role.title === 'Hiker',
		);
		if (hikerIndex >= 0) {
			return state.board.findIndex(
				(tile) => tile.id === state.players[hikerIndex].currentTileId,
			);
		}
		return -1;
	})();
	const neighboringTilePositions = findNeighboring(
		state.board,
		currentTileIndex,
		state.players[0].role.title,
	);
	const validTiles =
		state.selectedAction === 'Move'
			? findMoveable(
					state.board,
					neighboringTilePositions,
					state.board.findIndex((tile) => tile.id === hikerPosition),
					state.players[0],
				)
			: state.selectedAction === 'Remove Sand'
				? findSandPoints(
						state.board,
						currentTileIndex,
						neighboringTilePositions,
					)
				: [];

	return (
		<section
			className={`aspect-square w-100 md:max-w-full box-border grid grid-cols-5 gap-2 lg:w-auto lg:h-full ${className ?? ''}`}
		>
			{state.board.map((tile, index) => {
				const isHurricane = !tile.info;
				const invalidTile = !validTiles.includes(index);
				const isMoveOrRemoveAction = ['Move', 'Remove Sand'].includes(
					state.selectedAction ?? '',
				);
				const hasNoActions = state.actionCount === 0;

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
									dispatch({ type: 'REMOVE_SAND', tilePosition: index });
									break;
								}
								case 'Collect Part': {
									break;
								}
							}
						}}
					>
						{!tile.info && '🌪'}
						{tile.info && tile.info.sandPoints > 0 && (
							<span
								className={`absolute -right-2 -top-2 lg:right-1 lg:top-1 border rounded-full px-1.5 py-0.5 text-[8px] font-bold text-slate-950 ${tile.info.sandPoints > 1 ? 'bg-orange-600' : 'bg-amber-500/90'} md:text-[10px] xl:px-2 xl:text-base`}
							>
								{tile.info.sandPoints}
							</span>
						)}

						<div className="absolute left-1 top-1 grid grid-rows-2 grid-flow-col rtl gap-0.5 items-start pointer-events-none">
							{state.players
								.filter((player) => player.currentTileId === tile.id)
								.map((player) => {
									const isCurrentPlayer = player.id === state.players[0].id;
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

						<div className="absolute left-1 bottom-1 grid grid-rows-3 grid-flow-col rtl gap-0.5 items-start pointer-events-none"></div>

						{tile.info?.orientationEmoji && (
							<span className="absolute bottom-1 right-1 text-[10px] leading-none sm:text-sm md:text-lg">
								{tile.info.revealed ? tile.info.orientationEmoji : ''}
							</span>
						)}
					</button>
				);
			})}
		</section>
	);
}
