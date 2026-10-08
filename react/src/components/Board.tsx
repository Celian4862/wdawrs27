import { useGame } from '@/components/GameContext';
import PawnCircle from './player/PawnCircle';

export default function Board({ className }: { className?: string }) {
	const { state, dispatch } = useGame();

	return (
		<section
			className={`aspect-square w-100 md:max-w-full box-border grid grid-cols-5 gap-2 lg:w-auto lg:h-full ${className ?? ''}`}
		>
			{state.board.map((tile) => {
				return (
					<button
						key={tile.id}
						type="button"
						disabled={!tile.info}
						onClick={() => dispatch({ type: 'REVEAL_TILE', tile: tile.id })}
						className={`relative aspect-square border rounded-lg ease-in-out hover:duration-250 active:duration-100 motion-safe:transition-all ${!tile.info ? 'brightness-50 cursor-not-allowed' : 'hover:scale-115 active:brightness-50'} ${tile.info?.revealed ? tile.info.revealedTileColor : tile.info?.unrevealedTileColor}`}
					>
						{!tile.info && '🌪'}
						{tile.info && tile.info.sandPoints > 0 && (
							<span
								className={`absolute left-1 top-1 border rounded-full px-1 py-0.5 text-[5px] font-bold text-slate-950 ${tile.info.sandPoints > 1 ? 'bg-orange-600' : 'bg-amber-500/90'} sm:px-1.5 sm:text-[8px] md:text-[10px] xl:px-2 xl:text-base`}
							>
								{tile.info.sandPoints}
							</span>
						)}

						<div className="absolute right-1 top-1 grid grid-rows-3 grid-flow-col rtl gap-0.5 items-start pointer-events-none">
							{state.players
								.filter((player) => player.currentTileId === tile.id)
								.map((player) => (
									<PawnCircle
										key={player.role.color}
										color={player.role.color}
									/>
								))}
						</div>

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
