import { Fragment } from 'react/jsx-runtime';
import { findSandPoints } from '@/board/tiles';
import PawnCircle from '@/player/PawnCircle';
import { useGame } from '@/utility/GameContext';
import { parts } from '../part/parts';

export default function Board({ className }: { className?: string }) {
	const { state, dispatch, currentPlayer, hikerPlayer, findNeighboring } =
		useGame();

	// 1. Pull out the derived math so the JSX isn't choking on logic
	const currentTileIndex = state.board.findIndex(
		(t) => t.id === currentPlayer.currentTileId,
	);
	const neighboringTilePositions = findNeighboring(state.board);
	const hasNoActions = state.actionCount === 0;
	const isMoveOrRemoveAction = ['Move', 'Remove Sand'].includes(
		state.selectedAction ?? '',
	);

	const getIsValidTile = (index: number) => {
		if (state.selectedAction === 'Move') {
			const isNeighbor = neighboringTilePositions.includes(index);
			const isSafeSand = (state.board[index].info?.sandPoints ?? 2) < 2;
			const isHikerTile =
				index ===
				state.board.findIndex((t) => t.id === hikerPlayer?.currentTileId);
			return (
				isNeighbor &&
				(isSafeSand || isHikerTile || currentPlayer === hikerPlayer)
			);
		}
		if (state.selectedAction === 'Remove Sand') {
			return findSandPoints(
				state.board,
				currentTileIndex,
				neighboringTilePositions,
			).includes(index);
		}
		return false;
	};

	// 2. Clean up the massive inline switch statement into a single click handler
	const handleTileClick = (index: number, tileId: number) => {
		switch (state.selectedAction) {
			case 'Move': {
				const newPlayers = [...state.players];
				newPlayers[0].currentTileId = tileId;
				dispatch({ type: 'MOVE_TILES', players: newPlayers });
				break;
			}
			case 'Remove Sand': {
				const board = [...state.board];
				const targetTile = board[index];
				if (targetTile.info) {
					const sandReduction = currentPlayer.role.title === 'Digger' ? 2 : 1;
					board[index] = {
						...targetTile,
						info: {
							...targetTile.info,
							sandPoints: targetTile.info.sandPoints - sandReduction,
						},
					};
				}
				const nextSandPoints = findSandPoints(
					board,
					currentTileIndex,
					findNeighboring(board),
				);
				dispatch({
					type: 'REMOVE_SAND',
					board,
					nextAction: nextSandPoints.length === 0 && state.actionCount > 1,
				});
				break;
			}
		}
	};

	return (
		<section
			className={`box-border grid aspect-square w-100 grid-cols-5 gap-2 md:max-w-full lg:h-full lg:w-auto ${className ?? ''}`}
		>
			{state.board.map((tile, index) => {
				const invalidTile = !getIsValidTile(index);
				const { info } = tile;

				return (
					<Fragment key={tile.id}>
						{info ? (
							<button
								type="button"
								disabled={!state.selectedAction || invalidTile || hasNoActions}
								onClick={() => handleTileClick(index, tile.id)}
								className={`relative aspect-square rounded-lg border ease-in-out hover:duration-250 active:duration-100 motion-safe:transition-all ${
									invalidTile && isMoveOrRemoveAction
										? 'cursor-not-allowed brightness-50'
										: !invalidTile && isMoveOrRemoveAction
											? 'hover:scale-115 active:brightness-50'
											: ''
								} ${info.revealed ? info.revealedTileColor : info.unrevealedTileColor}`}
							>
								{/* Sand Counter Badge */}
								{info.sandPoints > 0 && (
									<span
										className={`absolute -top-1 -right-1 rounded-full border px-1.5 py-0.5 text-[8px] font-bold text-slate-950 lg:top-1 lg:right-1 ${info.sandPoints > 1 ? 'bg-orange-600' : 'bg-amber-500/90'} md:text-[10px] xl:px-2 xl:text-base`}
									>
										{info.sandPoints}
									</span>
								)}

								{/* Players on Tile */}
								<div className="rtl pointer-events-none absolute top-1 left-1 grid grid-flow-col grid-rows-2 items-start gap-0.5">
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

								{/* Parts on Tile */}
								{info.parts.length > 0 && (
									<div className="ltr pointer-events-none absolute bottom-1 left-1 grid grid-flow-col grid-rows-2 items-start gap-0.5">
										{info.parts.map((part) => (
											<span key={part} className="bg-black text-xs">
												{parts.find((p) => p.part === part)?.emoji}
											</span>
										))}
									</div>
								)}

								{/* Orientation Emoji */}
								{info.orientationEmoji && (
									<span className="absolute -right-1 -bottom-0.5 text-sm leading-none md:text-lg lg:right-1 lg:bottom-1">
										{info.revealed ? info.orientationEmoji : ''}
									</span>
								)}
							</button>
						) : (
							<div />
						)}
					</Fragment>
				);
			})}
		</section>
	);
}
